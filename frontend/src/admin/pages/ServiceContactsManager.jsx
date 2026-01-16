import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, User, Calendar, MessageSquare, Trash2, 
  CheckCircle, Clock, XCircle, Filter, Search
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import api from '../../services/api';

const ServiceContactsManager = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    closed: 0
  });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, statusFilter, searchQuery]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/service-contacts/');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/service-contacts/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.customer_name.toLowerCase().includes(query) ||
        c.customer_email.toLowerCase().includes(query) ||
        c.customer_phone.toLowerCase().includes(query) ||
        c.service_name.toLowerCase().includes(query)
      );
    }

    setFilteredContacts(filtered);
  };

  const handleUpdateStatus = async (contactId, newStatus) => {
    try {
      await api.put(`/service-contacts/${contactId}`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchContacts();
      fetchStats();
      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAddNotes = async (contactId, notes) => {
    try {
      await api.put(`/service-contacts/${contactId}`, { admin_notes: notes });
      toast.success('Notes saved successfully');
      fetchContacts();
      if (selectedContact && selectedContact.id === contactId) {
        setSelectedContact({ ...selectedContact, admin_notes: notes });
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await api.delete(`/service-contacts/${contactId}`);
      toast.success('Contact deleted successfully');
      fetchContacts();
      fetchStats();
      setShowDetailsDialog(false);
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" style={{ color: '#3b82f6' }} />;
      case 'contacted':
        return <MessageSquare className="h-4 w-4" style={{ color: '#f59e0b' }} />;
      case 'converted':
        return <CheckCircle className="h-4 w-4" style={{ color: '#10b981' }} />;
      case 'closed':
        return <XCircle className="h-4 w-4" style={{ color: '#6b7280' }} />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return '#3b82f6';
      case 'contacted':
        return '#f59e0b';
      case 'converted':
        return '#10b981';
      case 'closed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
          Service Contact Requests
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Manage customer inquiries for your services
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <Card style={{ padding: '20px', background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
          <div style={{ color: '#ffffff' }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Requests</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{stats.total}</div>
          </div>
        </Card>

        <Card style={{ padding: '20px', background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
          <div style={{ color: '#ffffff' }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>New</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{stats.new}</div>
          </div>
        </Card>

        <Card style={{ padding: '20px', background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
          <div style={{ color: '#ffffff' }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Contacted</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{stats.contacted}</div>
          </div>
        </Card>

        <Card style={{ padding: '20px', background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}>
          <div style={{ color: '#ffffff' }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Converted</div>
            <div style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px' }}>{stats.converted}</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                width: '20px',
                height: '20px'
              }} />
              <Input
                placeholder="Search by name, email, phone, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div style={{ minWidth: '200px' }}>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={() => {
              setStatusFilter('all');
              setSearchQuery('');
            }}
            variant="outline"
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Contacts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Loading contacts...
        </div>
      ) : filteredContacts.length === 0 ? (
        <Card style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>No contacts found</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredContacts.map((contact) => (
            <Card 
              key={contact.id}
              style={{
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: `2px solid ${contact.status === 'new' ? '#3b82f6' : '#e5e7eb'}`
              }}
              onClick={() => {
                setSelectedContact(contact);
                setShowDetailsDialog(true);
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {contact.customer_name}
                    </h3>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      background: getStatusColor(contact.status) + '20',
                      color: getStatusColor(contact.status),
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {getStatusIcon(contact.status)}
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail className="h-4 w-4" />
                      <span>{contact.customer_email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone className="h-4 w-4" />
                      <span>{contact.customer_phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(contact.created_at).toLocaleDateString()} at {new Date(contact.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #7C5CFF 100%)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {contact.service_name}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Details Dialog */}
      {selectedContact && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <DialogHeader>
              <DialogTitle style={{ fontSize: '24px', fontWeight: '700' }}>
                Contact Request Details
              </DialogTitle>
            </DialogHeader>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Customer Info */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                  Customer Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <User className="h-5 w-5" style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '15px' }}>{selectedContact.customer_name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail className="h-5 w-5" style={{ color: '#6b7280' }} />
                    <a href={`mailto:${selectedContact.customer_email}`} style={{ fontSize: '15px', color: '#3b82f6' }}>
                      {selectedContact.customer_email}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone className="h-5 w-5" style={{ color: '#6b7280' }} />
                    <a href={`tel:${selectedContact.customer_phone}`} style={{ fontSize: '15px', color: '#3b82f6' }}>
                      {selectedContact.customer_phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                  Service Requested
                </h4>
                <div style={{
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #7C5CFF 100%)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  {selectedContact.service_name}
                </div>
              </div>

              {/* Message */}
              {selectedContact.message && (
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                    Customer Message
                  </h4>
                  <div style={{
                    padding: '12px 16px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#374151',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedContact.message}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div>
                <Label style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block', color: '#1f2937' }}>
                  Update Status
                </Label>
                <Select 
                  value={selectedContact.status} 
                  onValueChange={(value) => handleUpdateStatus(selectedContact.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Notes */}
              <div>
                <Label style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block', color: '#1f2937' }}>
                  Admin Notes
                </Label>
                <Textarea
                  defaultValue={selectedContact.admin_notes || ''}
                  placeholder="Add internal notes about this contact..."
                  rows={4}
                  onBlur={(e) => {
                    if (e.target.value !== (selectedContact.admin_notes || '')) {
                      handleAddNotes(selectedContact.id, e.target.value);
                    }
                  }}
                />
              </div>

              {/* Timestamps */}
              <div style={{ fontSize: '13px', color: '#9ca3af', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                <div>Created: {new Date(selectedContact.created_at).toLocaleString()}</div>
                <div>Last Updated: {new Date(selectedContact.updated_at).toLocaleString()}</div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                <Button
                  onClick={() => handleDeleteContact(selectedContact.id)}
                  variant="destructive"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Contact
                </Button>
                <Button
                  onClick={() => setShowDetailsDialog(false)}
                  variant="outline"
                  style={{ marginLeft: 'auto' }}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ServiceContactsManager;
