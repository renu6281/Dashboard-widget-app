import React, { useState, useMemo } from 'react';
import { X, Plus, Search } from 'lucide-react';

// Initial dashboard data
const initialDashboardData = {
  categories: [
    {
      id: 'cspm',
      name: 'CSPM Executive Dashboard',
      widgets: [
        {
          id: 'widget-1',
          name: 'Cloud Accounts',
          text: 'Total: 2 accounts connected. Active monitoring across AWS and Azure environments.'
        },
        {
          id: 'widget-2',
          name: 'Cloud Account Risk Assessment',
          text: 'Risk Level: Medium. 1,234 resources scanned. 45 high-priority alerts detected.'
        }
      ]
    },
    {
      id: 'cwpp',
      name: 'CWPP Dashboard',
      widgets: [
        {
          id: 'widget-3',
          name: 'Top 5 Namespace Specific Alerts',
          text: 'Production: 23 alerts, Staging: 12 alerts, Development: 8 alerts'
        },
        {
          id: 'widget-4',
          name: 'Workload Alerts',
          text: 'Active workloads: 156. Critical alerts: 5. Warning alerts: 23.'
        }
      ]
    },
    {
      id: 'registry',
      name: 'Registry Scan',
      widgets: [
        {
          id: 'widget-5',
          name: 'Image Risk Assessment',
          text: 'Total Images: 542. Critical vulnerabilities: 12. High: 45. Medium: 123.'
        },
        {
          id: 'widget-6',
          name: 'Image Security Issues',
          text: 'Scanned: 542 images. Failed: 23. Passed: 519. Scan coverage: 96%'
        }
      ]
    }
  ]
};

const App = () => {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newWidget, setNewWidget] = useState({ name: '', text: '' });
  const [showManageWidgets, setShowManageWidgets] = useState(false);

  // Search functionality
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return dashboardData.categories;

    return dashboardData.categories.map(category => ({
      ...category,
      widgets: category.widgets.filter(widget =>
        widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        widget.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.widgets.length > 0);
  }, [dashboardData, searchQuery]);

  // Add widget
  const handleAddWidget = () => {
    if (!newWidget.name.trim() || !selectedCategory) return;

    const newWidgetData = {
      id: `widget-${Date.now()}`,
      name: newWidget.name,
      text: newWidget.text || 'No description provided.'
    };

    setDashboardData(prev => ({
      categories: prev.categories.map(cat =>
        cat.id === selectedCategory
          ? { ...cat, widgets: [...cat.widgets, newWidgetData] }
          : cat
      )
    }));

    setNewWidget({ name: '', text: '' });
    setShowAddWidget(false);
    setSelectedCategory(null);
  };

  // Remove widget
  const handleRemoveWidget = (categoryId, widgetId) => {
    setDashboardData(prev => ({
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, widgets: cat.widgets.filter(w => w.id !== widgetId) }
          : cat
      )
    }));
  };

  // Toggle widget from manage panel
  const toggleWidgetInCategory = (categoryId, widget, isChecked) => {
    if (isChecked) {
      setDashboardData(prev => ({
        categories: prev.categories.map(cat =>
          cat.id === categoryId
            ? { ...cat, widgets: [...cat.widgets, widget] }
            : cat
        )
      }));
    } else {
      handleRemoveWidget(categoryId, widget.id);
    }
  };

  // Get all widgets for manage panel
  const getAllWidgets = () => {
    const allWidgets = [];
    dashboardData.categories.forEach(category => {
      category.widgets.forEach(widget => {
        allWidgets.push({ ...widget, categoryId: category.id, categoryName: category.name });
      });
    });
    return allWidgets;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Actions Bar */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowManageWidgets(true)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Manage Widgets
          </button>
        </div>

        {/* Categories and Widgets */}
        <div className="space-y-6">
          {filteredCategories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                <button
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowAddWidget(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Widget
                </button>
              </div>

              {/* Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.widgets.map(widget => (
                  <div
                    key={widget.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => handleRemoveWidget(category.id, widget.id)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      title="Remove widget"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                    <h3 className="font-semibold text-gray-900 mb-2 pr-8">{widget.name}</h3>
                    <p className="text-sm text-gray-600">{widget.text}</p>
                  </div>
                ))}

                {/* Add Widget Placeholder */}
                <button
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowAddWidget(true);
                  }}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors min-h-32"
                >
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Add Widget</span>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No widgets found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Widget</h3>
              <button
                onClick={() => {
                  setShowAddWidget(false);
                  setNewWidget({ name: '', text: '' });
                  setSelectedCategory(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Widget Name *
                </label>
                <input
                  type="text"
                  value={newWidget.name}
                  onChange={(e) => setNewWidget(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter widget name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Widget Text
                </label>
                <textarea
                  value={newWidget.text}
                  onChange={(e) => setNewWidget(prev => ({ ...prev, text: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter widget description"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowAddWidget(false);
                    setNewWidget({ name: '', text: '' });
                    setSelectedCategory(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWidget}
                  disabled={!newWidget.name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Widget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Widgets Panel */}
      {showManageWidgets && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Manage Widgets</h3>
              <button
                onClick={() => setShowManageWidgets(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {dashboardData.categories.map(category => (
                <div key={category.id} className="mb-6 last:mb-0">
                  <h4 className="font-semibold text-gray-900 mb-3">{category.name}</h4>
                  <div className="space-y-2">
                    {getAllWidgets()
                      .filter(w => w.categoryId === category.id)
                      .map(widget => {
                        const isChecked = category.widgets.some(w => w.id === widget.id);
                        return (
                          <label
                            key={widget.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => toggleWidgetInCategory(category.id, widget, e.target.checked)}
                              className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{widget.name}</div>
                              <div className="text-sm text-gray-600">{widget.text}</div>
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowManageWidgets(false)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
