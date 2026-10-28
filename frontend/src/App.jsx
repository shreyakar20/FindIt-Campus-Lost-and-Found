import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DashboardStats from './components/DashboardStats';
import SearchAndFilters from './components/SearchAndFilters';
import ItemCard from './components/ItemCard';
import ItemForm from './components/ItemForm';
import EditItemForm from './components/EditItemForm';
import ConfirmationDialog from './components/ConfirmationDialog';
import EmptyState from './components/EmptyState';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import './App.css';

// Build dynamic API URL using VITE_API_URL or relative fallback
const getApiUrl = (endpoint) => {
  const base = import.meta.env.VITE_API_URL || '';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
};

function App() {
  // Application Data States
  const [items, setItems] = useState([]);
  const [allStatsItems, setAllStatsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal & Dialog States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('Lost');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check Backend Health
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl('/api/health'));
      if (res.ok) {
        setBackendConnected(true);
      } else {
        setBackendConnected(false);
      }
    } catch {
      setBackendConnected(false);
    }
  }, []);

  // Fetch Items from MongoDB Backend API
  const fetchItems = useCallback(async (search = '', status = 'All', category = 'All') => {
    setLoading(true);
    setError(null);

    try {
      // Build query string for backend API filtering
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (status !== 'All') params.append('status', status);
      if (category !== 'All') params.append('category', category);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(getApiUrl(`/api/items${queryString}`));

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const itemsList = Array.isArray(result) ? result : result.data || [];
      setItems(itemsList);
      setBackendConnected(true);

      // If unfiltered, also update stats baseline
      if (!search.trim() && status === 'All' && category === 'All') {
        setAllStatsItems(itemsList);
      }
    } catch (err) {
      console.error('Error fetching items from API:', err);
      setError(err.message || 'Failed to connect to FindIt API server.');
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Baseline fetch for stats whenever database records change
  const refreshBaselineStats = async () => {
    try {
      const response = await fetch(getApiUrl('/api/items'));
      if (response.ok) {
        const result = await response.json();
        const itemsList = Array.isArray(result) ? result : result.data || [];
        setAllStatsItems(itemsList);
      }
    } catch (err) {
      console.error('Error refreshing baseline stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchItems(searchQuery, statusFilter, categoryFilter);
    refreshBaselineStats();
  }, [checkHealth]);

  // Debounced/Reactive filter fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(searchQuery, statusFilter, categoryFilter);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, categoryFilter, fetchItems]);

  // Calculate live statistics from actual backend records
  const stats = {
    total: allStatsItems.length,
    lost: allStatsItems.filter((i) => i.status === 'Lost').length,
    found: allStatsItems.filter((i) => i.status === 'Found').length,
    returned: allStatsItems.filter((i) => i.status === 'Returned').length
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
  };

  // Handle open report modal
  const handleOpenReportModal = (type = 'Lost') => {
    setReportType(type);
    setIsReportModalOpen(true);
  };

  // Scroll smoothly to listings
  const handleScrollToListings = () => {
    const el = document.getElementById('listings-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // CREATE ITEM (POST /api/items)
  const handleCreateItem = async (formData) => {
    setIsSubmittingReport(true);
    try {
      const response = await fetch(getApiUrl('/api/items'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create item');
      }

      showToast(`Successfully reported "${formData.itemName}"!`, 'success');
      setIsReportModalOpen(false);

      // Refresh listings and stats from MongoDB
      await fetchItems(searchQuery, statusFilter, categoryFilter);
      await refreshBaselineStats();
    } catch (err) {
      console.error('Error creating item:', err);
      showToast(err.message || 'Failed to submit item report.', 'error');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // UPDATE ITEM (PUT /api/items/:id)
  const handleUpdateItem = async (id, updatedFields) => {
    setIsUpdating(true);
    try {
      const response = await fetch(getApiUrl(`/api/items/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update item');
      }

      showToast(`Listing for "${updatedFields.itemName || 'item'}" updated!`, 'success');
      setEditingItem(null);

      // Refresh listings and stats
      await fetchItems(searchQuery, statusFilter, categoryFilter);
      await refreshBaselineStats();
    } catch (err) {
      console.error('Error updating item:', err);
      showToast(err.message || 'Failed to update listing.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // QUICK MARK AS RETURNED
  const handleQuickMarkReturned = async (item) => {
    try {
      const response = await fetch(getApiUrl(`/api/items/${item._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Returned' })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      showToast(`Item "${item.itemName}" marked as Returned! 🎉`, 'success');

      // Refresh listings and stats
      await fetchItems(searchQuery, statusFilter, categoryFilter);
      await refreshBaselineStats();
    } catch (err) {
      console.error('Error marking item as returned:', err);
      showToast(err.message || 'Failed to mark item as returned.', 'error');
    }
  };

  // DELETE ITEM (DELETE /api/items/:id)
  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      const response = await fetch(getApiUrl(`/api/items/${deletingItem._id}`), {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete item');
      }

      showToast(`"${deletingItem.itemName}" removed from portal.`, 'success');
      setDeletingItem(null);

      // Refresh listings and stats
      await fetchItems(searchQuery, statusFilter, categoryFilter);
      await refreshBaselineStats();
    } catch (err) {
      console.error('Error deleting item:', err);
      showToast(err.message || 'Failed to delete item.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        onOpenReportModal={handleOpenReportModal}
        backendConnected={backendConnected}
        totalCount={stats.total}
      />

      <main className="main-content">
        {/* Hero Section */}
        <Hero
          onOpenReportModal={handleOpenReportModal}
          onScrollToListings={handleScrollToListings}
        />

        <div className="portal-body-wrapper">
          {/* Dashboard Summary Statistics */}
          <DashboardStats
            stats={stats}
            activeStatusFilter={statusFilter}
            onSelectStatusFilter={(status) => {
              setStatusFilter(status);
              handleScrollToListings();
            }}
          />

          {/* Search & Category Filter Controls */}
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            onResetFilters={handleResetFilters}
            totalResults={items.length}
            totalItems={allStatsItems.length}
          />

          {/* Error Banner if API connection fails */}
          {error && !loading && (
            <div className="error-banner">
              <strong>Unable to reach MongoDB API:</strong> {error}
              <p className="error-tip">
                Ensure the Express backend is running (<code>cd backend &amp;&amp; npm start</code>) and your <code>MONGO_URI</code> is properly configured in <code>backend/.env</code>.
              </p>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => fetchItems(searchQuery, statusFilter, categoryFilter)}
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Items Listing Grid */}
          <section className="listings-grid-section">
            {loading ? (
              <LoadingSpinner message="Fetching campus lost &amp; found listings..." />
            ) : items.length === 0 ? (
              <EmptyState
                isFiltered={
                  searchQuery.trim() !== '' ||
                  statusFilter !== 'All' ||
                  categoryFilter !== 'All'
                }
                onResetFilters={handleResetFilters}
                onOpenReportModal={() => handleOpenReportModal('Lost')}
              />
            ) : (
              <div className="items-grid">
                {items.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onEdit={(itemToEdit) => setEditingItem(itemToEdit)}
                    onDelete={(itemToDelete) => setDeletingItem(itemToDelete)}
                    onQuickMarkReturned={handleQuickMarkReturned}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-title">
            <strong>FindIt</strong> — Campus Lost &amp; Found Portal
          </p>
          <p className="footer-sub">
            Built with React, Node.js, Express, and MongoDB Atlas. Developed for college campus assignment.
          </p>
          <div className="footer-links">
            <span>CRUD Operations Active</span>
            <span>•</span>
            <span>REST API Verified</span>
            <span>•</span>
            <span>MongoDB Cloud Connected</span>
          </div>
        </div>
      </footer>

      {/* Report Modal */}
      <ItemForm
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateItem}
        initialType={reportType}
        isSubmitting={isSubmittingReport}
      />

      {/* Edit Modal */}
      <EditItemForm
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        onUpdate={handleUpdateItem}
        item={editingItem}
        isSubmitting={isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteItem}
        title="Delete Listing"
        message="Are you sure you want to permanently delete this item listing?"
        itemName={deletingItem?.itemName}
        isDeleting={isDeleting}
      />

      {/* Floating Feedback Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
