'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  Loader2,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { inquiryAPI } from '@/lib/api';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import { FormSelect } from '@/components/shared/FormSelect';
import { INQUIRY_STATUS, INQUIRY_TYPES } from '@/lib/constants';
import toast from 'react-hot-toast';

const statusIcons = {
  new: Clock,
  contacted: CheckCircle,
  qualified: CheckCircle,
  closed: CheckCircle,
};

const statusColors = {
  new: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  contacted: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  qualified: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
  closed: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [notes, setNotes] = useState('');

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await inquiryAPI.getAll(params);
      setLeads(response.data.data);
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const handleUpdateLead = async () => {
    if (!selectedLead) return;

    try {
      await inquiryAPI.update(selectedLead._id, {
        status: updateStatus,
        notes: notes,
      });
      toast.success('Lead updated successfully');
      setSelectedLead(null);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update lead');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await inquiryAPI.delete(id);
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.propertyId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer inquiries and leads</p>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <FormSelect
            options={[{ value: '', label: 'All Status' }, ...INQUIRY_STATUS]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
        </div>
      </FadeIn>

      {/* Leads Table */}
      <FadeIn delay={0.2}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Lead</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Property</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredLeads.map((lead) => {
                    const StatusIcon = statusIcons[lead.status];
                    const typeLabel = INQUIRY_TYPES.find(t => t.value === lead.type)?.label || lead.type;

                    return (
                      <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {lead.phone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 dark:text-white">{lead.propertyId?.title || 'General Inquiry'}</p>
                          {lead.propertyId?.location?.city && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{lead.propertyId.location.city}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{typeLabel}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusColors[lead.status]}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {INQUIRY_STATUS.find(s => s.value === lead.status)?.label || lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {formatDate(lead.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setUpdateStatus(lead.status);
                                setNotes(lead.notes || '');
                              }}
                              className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead._id)}
                              className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lead Details</h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Lead Info */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 dark:text-gray-400">Name:</span> <span className="text-gray-900 dark:text-white">{selectedLead.name}</span></p>
                  <p><span className="text-gray-500 dark:text-gray-400">Email:</span> <span className="text-gray-900 dark:text-white">{selectedLead.email}</span></p>
                  <p><span className="text-gray-500 dark:text-gray-400">Phone:</span> <span className="text-gray-900 dark:text-white">{selectedLead.phone}</span></p>
                </div>
              </div>

              {/* Property Info */}
              {selectedLead.propertyId && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Interested Property</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLead.propertyId.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{selectedLead.propertyId.location?.city}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Message</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                  {selectedLead.message}
                </p>
              </div>

              {/* Update Status */}
              <FormSelect
                label="Update Status"
                options={INQUIRY_STATUS}
                value={updateStatus}
                onChange={setUpdateStatus}
              />

              {/* Notes */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this lead..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => setSelectedLead(null)}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateLead}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Update Lead
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
