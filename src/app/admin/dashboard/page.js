'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  LayoutDashboard,
  Map,
  Settings,
  Globe,
  BarChart3,
} from 'lucide-react';
import { analyticsAPI, inquiryAPI, propertyAPI } from '@/lib/api';
import { FadeIn } from '@/components/shared/animations/FadeIn';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import toast from 'react-hot-toast';
import Link from 'next/link';

function StatsCard({ title, value, icon: Icon, trend, trendUp, color }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-violet-600',
    amber: 'from-amber-500 to-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${colors[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function RecentLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await inquiryAPI.getRecent(5);
        setLeads(response.data.data);
      } catch (error) {
        toast.error('Failed to load recent leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const statusColors = {
    new: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    qualified: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    closed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Leads</h3>
        <Link href="/admin/leads" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : leads.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No leads yet</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div key={lead._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lead.propertyId?.title || 'General Inquiry'}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                {lead.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function QuickNav() {
  const navItems = [
    { href: '/admin/properties', label: 'Properties', icon: Home, color: 'from-blue-500 to-blue-600' },
    { href: '/admin/leads', label: 'Leads', icon: Users, color: 'from-purple-500 to-violet-600' },
    { href: '/admin/websiteDashboard', label: 'Website', icon: Globe, color: 'from-pink-500 to-rose-600' },
    { href: '/admin/webGISMap', label: 'GIS Map', icon: Map, color: 'from-green-500 to-emerald-600' },
    { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'from-gray-600 to-gray-700' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Navigation</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link key={index} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-lg transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.getDashboard();
        setStats(response.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const propertyStatusData = stats ? [
    { name: 'Available', value: stats.properties.available || 0, color: '#22c55e' },
    { name: 'Sold', value: stats.properties.sold || 0, color: '#ef4444' },
    { name: 'Reserved', value: stats.properties.reserved || 0, color: '#f59e0b' },
  ] : [];

  const inquiryStatusData = stats ? [
    { name: 'New', value: stats.inquiries.new || 0, color: '#3b82f6' },
    { name: 'Contacted', value: stats.inquiries.contacted || 0, color: '#f59e0b' },
    { name: 'Qualified', value: stats.inquiries.qualified || 0, color: '#8b5cf6' },
    { name: 'Closed', value: stats.inquiries.closed || 0, color: '#22c55e' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6 lg:p-8">
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back! Here&apos;s what&apos;s happening with your properties.</p>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Properties"
          value={stats?.properties.total || 0}
          icon={Home}
          color="blue"
        />
        <StatsCard
          title="Available"
          value={stats?.properties.available || 0}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Total Leads"
          value={stats?.inquiries.total || 0}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Total Views"
          value={stats?.properties.totalViews || 0}
          icon={Eye}
          color="amber"
        />
      </div>

      {/* Quick Navigation Section */}
      <FadeIn delay={0.05}>
        <div className="mb-8">
          <QuickNav />
        </div>
      </FadeIn>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Property Status Chart */}
        <FadeIn delay={0.1}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Property Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {propertyStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Inquiry Status Chart */}
        <FadeIn delay={0.2}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Lead Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inquiryStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Recent Leads */}
      <FadeIn delay={0.3}>
        <RecentLeads />
      </FadeIn>
    </div>
  );
}
