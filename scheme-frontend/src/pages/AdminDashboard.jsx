import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Layers, ShieldCheck, AlertOctagon, Users, BarChart3, PlusCircle, 
  CheckCircle, HelpCircle, FilePlus, Shield, RefreshCw, UploadCloud, Download, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scheme CRUD Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [nameEn, setNameEn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [eligibilityDescEn, setEligibilityDescEn] = useState('');
  const [benefitEn, setBenefitEn] = useState('');
  const [benefitCalculatorExpr, setBenefitCalculatorExpr] = useState('');
  const [officialSourceUrl, setOfficialSourceUrl] = useState('');
  const [departmentEn, setDepartmentEn] = useState('');
  const [category, setCategory] = useState('EDUCATION');
  const [beneficiaryType, setBeneficiaryType] = useState('ALL');
  const [isCentral, setIsCentral] = useState(true);
  const [stateName, setStateName] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [status, setStatus] = useState('OPEN');

  // Rule adding form state
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [ruleFieldName, setRuleFieldName] = useState('annualIncome');
  const [ruleOperator, setRuleOperator] = useState('LTE');
  const [ruleValue, setRuleValue] = useState('');
  const [ruleIsCritical, setRuleIsCritical] = useState(true);
  const [ruleMessageEn, setRuleMessageEn] = useState('');

  // Required Document adding state
  const [docNameEn, setDocNameEn] = useState('');
  const [docIsMandatory, setDocIsMandatory] = useState(true);

  // Automated Ingestion & Batch Sync State
  const [batchFile, setBatchFile] = useState(null);
  const [uploadingBatch, setUploadingBatch] = useState(false);
  const [batchMessage, setBatchMessage] = useState(null);
  const [syncingFeeds, setSyncingFeeds] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, schemesRes, reportsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/schemes/public/search?size=100'),
        axios.get('/api/admin/reports')
      ]);

      setStats(statsRes.data);
      setSchemes(schemesRes.data.content);
      setReports(reportsRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyScheme = async (schemeId, newStatus) => {
    try {
      await axios.put(`/api/admin/schemes/${schemeId}/verify?status=${newStatus}`);
      fetchAdminData();
    } catch (err) {
      console.error('Error verifying scheme', err);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}/resolve`);
      fetchAdminData();
    } catch (err) {
      console.error('Error resolving report', err);
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/schemes', {
        nameEn,
        descriptionEn,
        eligibilityDescEn,
        benefitEn,
        benefitCalculatorExpr,
        officialSourceUrl,
        departmentEn,
        category,
        beneficiaryType,
        isCentral,
        stateName: isCentral ? undefined : stateName,
        deadlineDate: deadlineDate || undefined,
        status
      });

      // Clear Form
      setNameEn('');
      setDescriptionEn('');
      setEligibilityDescEn('');
      setBenefitEn('');
      setBenefitCalculatorExpr('');
      setOfficialSourceUrl('');
      setDepartmentEn('');
      setShowAddForm(false);
      
      fetchAdminData();
    } catch (err) {
      console.error('Error creating scheme', err);
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!selectedSchemeId) return;

    try {
      await axios.post(`/api/admin/schemes/${selectedSchemeId}/rules`, {
        fieldName: ruleFieldName,
        operator: ruleOperator,
        ruleValue,
        isCritical: ruleIsCritical,
        messageEn: ruleMessageEn
      });

      setRuleValue('');
      setRuleMessageEn('');
      setSelectedSchemeId(null);
      fetchAdminData();
    } catch (err) {
      console.error('Error adding eligibility rule', err);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!selectedSchemeId) return;

    try {
      await axios.post(`/api/admin/schemes/${selectedSchemeId}/documents`, {
        documentNameEn: docNameEn,
        isMandatory: docIsMandatory
      });

      setDocNameEn('');
      setSelectedSchemeId(null);
      fetchAdminData();
    } catch (err) {
      console.error('Error adding required document', err);
    }
  };

  // Trigger Live Government Feeds Sync
  const handleSyncFeeds = async () => {
    try {
      setSyncingFeeds(true);
      setSyncMessage(null);
      const res = await axios.post('/api/admin/schemes/sync-feeds');
      setSyncMessage({ success: res.data.success, text: res.data.message });
      fetchAdminData();
    } catch (err) {
      setSyncMessage({ success: false, text: 'Feed synchronization failed: ' + (err.response?.data?.message || err.message) });
    } finally {
      setSyncingFeeds(false);
    }
  };

  // Upload Batch File (JSON or CSV)
  const handleBatchUpload = async (e) => {
    e.preventDefault();
    if (!batchFile) return;

    try {
      setUploadingBatch(true);
      setBatchMessage(null);
      const formData = new FormData();
      formData.append('file', batchFile);

      const res = await axios.post('/api/admin/schemes/batch-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setBatchMessage({ success: res.data.success, text: res.data.message });
      setBatchFile(null);
      fetchAdminData();
    } catch (err) {
      setBatchMessage({ success: false, text: 'Batch upload failed: ' + (err.response?.data?.message || err.message) });
    } finally {
      setUploadingBatch(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Loading Admin Portal statistics...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-danger bg-opacity-10 text-danger fw-bold px-3 py-1 rounded-pill">
              <Shield size={14} className="me-1" />
              Role: {user?.role}
            </span>
          </div>
          <h2 className="fw-bold text-dark mb-0">myScheme National Admin & Department Portal</h2>
          <p className="text-muted small mb-0">Audit verification queues, append SpEL evaluation rules, and manage automated ingestion pipelines.</p>
        </div>
        
        <div className="d-flex gap-2 flex-wrap">
          <button 
            className="btn btn-outline-success d-flex align-items-center gap-2 fw-semibold"
            onClick={handleSyncFeeds}
            disabled={syncingFeeds}
          >
            <RefreshCw size={16} className={syncingFeeds ? 'spin' : ''} />
            <span>{syncingFeeds ? 'Synchronizing...' : '⚡ Run Auto-Sync Feeds'}</span>
          </button>
          
          <button className="btn btn-myscheme-primary d-flex align-items-center gap-2" onClick={() => setShowAddForm(!showAddForm)}>
            <PlusCircle size={18} />
            Create New Scheme
          </button>
        </div>
      </div>

      {/* Sync / Feed Alerts */}
      {syncMessage && (
        <div className={`alert ${syncMessage.success ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 shadow-sm rounded-3 mb-4`}>
          {syncMessage.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{syncMessage.text}</span>
        </div>
      )}

      {/* Analytics stats row */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card shadow-sm border-0 bg-white p-3 rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted small mb-1">Total Schemes</h6>
                  <h3 className="fw-bold mb-0 text-dark">{stats.totalSchemes}</h3>
                </div>
                <div className="p-2 bg-success bg-opacity-10 rounded-circle text-success">
                  <Layers size={24} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 col-6">
            <div className="card shadow-sm border-0 bg-white p-3 rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted small mb-1">Active Schemes</h6>
                  <h3 className="fw-bold mb-0 text-success">{stats.activeSchemes}</h3>
                </div>
                <div className="p-2 bg-success bg-opacity-10 rounded-circle text-success">
                  <ShieldCheck size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="card shadow-sm border-0 bg-white p-3 rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted small mb-1">Citizen Reports</h6>
                  <h3 className="fw-bold mb-0 text-danger">{stats.pendingReports}</h3>
                </div>
                <div className="p-2 bg-danger bg-opacity-10 rounded-circle text-danger">
                  <AlertOctagon size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="card shadow-sm border-0 bg-white p-3 rounded-3 h-100">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted small mb-1">Registered Citizens</h6>
                  <h3 className="fw-bold mb-0 text-primary">{stats.registeredUsers}</h3>
                </div>
                <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary">
                  <Users size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Automated Scheme Ingestion & Batch Synchronizer Card */}
      <div className="card shadow-sm border-0 bg-white p-4 mb-4 rounded-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom pb-3 mb-3 gap-2">
          <div>
            <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <UploadCloud size={20} className="text-success" />
              Automated Batch Ingestion & Feed Synchronizer
            </h5>
            <p className="text-muted small mb-0">
              Bulk-upload department catalogs (JSON/CSV) or trigger real-time government feed synchronization into the audit queue.
            </p>
          </div>

          <a 
            href="/sample_schemes_batch.json" 
            download="sample_schemes_batch.json" 
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
          >
            <Download size={14} />
            <span>Sample JSON Template</span>
          </a>
        </div>

        {batchMessage && (
          <div className={`alert ${batchMessage.success ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2 p-3 small rounded-3 mb-3`}>
            {batchMessage.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{batchMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleBatchUpload} className="row g-3 align-items-center">
          <div className="col-md-8">
            <label className="form-label small fw-semibold text-dark">Select Batch Scheme Catalog (.json or .csv)</label>
            <input 
              type="file" 
              className="form-control" 
              accept=".json,.csv"
              onChange={(e) => setBatchFile(e.target.files ? e.target.files[0] : null)}
              required
            />
            <span className="small text-muted" style={{ fontSize: '11px' }}>
              Supports structured JSON format with SpEL criteria rules & required documents checklists, or standard CSV format.
            </span>
          </div>

          <div className="col-md-4 mt-md-4 pt-md-2">
            <button 
              type="submit" 
              className="btn btn-myscheme-primary w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={uploadingBatch || !batchFile}
            >
              <UploadCloud size={16} />
              <span>{uploadingBatch ? 'Ingesting Batch...' : 'Upload & Ingest Schemes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Category distribution charts */}
      {stats && stats.schemesByCategory && (
        <div className="card shadow-sm p-4 mb-4 border-0 bg-white rounded-4">
          <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <BarChart3 size={20} className="text-success" />
            Schemes Distribution By Domain Category
          </h5>
          <div className="row g-3">
            {Object.entries(stats.schemesByCategory).map(([cat, count]) => {
              const percentage = stats.totalSchemes > 0 ? (count / stats.totalSchemes) * 100 : 0;
              return (
                <div key={cat} className="col-md-6 mb-2">
                  <div className="d-flex justify-content-between mb-1 small fw-semibold">
                    <span className="text-dark">{cat}</span>
                    <span className="text-muted">{count} Schemes ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Scheme Form Modal / Drawer */}
      {showAddForm && (
        <div className="card border-0 bg-white mb-4 p-4 shadow-sm rounded-4">
          <h4 className="fw-bold text-dark mb-3">Onboard New Government Scheme Manually</h4>
          <form onSubmit={handleCreateScheme}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Scheme Name (English)</label>
                <input type="text" className="form-control" value={nameEn} onChange={e => setNameEn(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Department / Ministry (English)</label>
                <input type="text" className="form-control" value={departmentEn} onChange={e => setDepartmentEn(e.target.value)} required />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Description (English)</label>
                <textarea className="form-control" rows={3} value={descriptionEn} onChange={e => setDescriptionEn(e.target.value)} required />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Eligibility Details Summary (English)</label>
                <textarea className="form-control" rows={2} value={eligibilityDescEn} onChange={e => setEligibilityDescEn(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Benefit Description (English)</label>
                <input type="text" className="form-control" value={benefitEn} onChange={e => setBenefitEn(e.target.value)} placeholder="e.g. ₹20,000 per year" required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Benefit SpEL Calculator Expr (Optional)</label>
                <input type="text" className="form-control" value={benefitCalculatorExpr} onChange={e => setBenefitCalculatorExpr(e.target.value)} placeholder="e.g. #annualIncome < 150000 ? 20000 : 10000" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Official Source Link (URL)</label>
                <input type="url" className="form-control" value={officialSourceUrl} onChange={e => setOfficialSourceUrl(e.target.value)} required />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="EDUCATION">EDUCATION</option>
                  <option value="AGRICULTURE">AGRICULTURE</option>
                  <option value="HEALTH">HEALTH</option>
                  <option value="HOUSING">HOUSING</option>
                  <option value="FINANCIAL">FINANCIAL</option>
                  <option value="BUSINESS">BUSINESS</option>
                  <option value="WOMEN">WOMEN</option>
                  <option value="SOCIAL">SOCIAL</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Beneficiary Type</label>
                <select className="form-select" value={beneficiaryType} onChange={e => setBeneficiaryType(e.target.value)}>
                  <option value="ALL">ALL</option>
                  <option value="STUDENTS">STUDENTS</option>
                  <option value="FARMERS">FARMERS</option>
                  <option value="WOMEN">WOMEN</option>
                  <option value="SENIOR_CITIZENS">SENIOR_CITIZENS</option>
                </select>
              </div>
              <div className="col-md-3">
                <div className="form-check form-switch mt-4 pt-2">
                  <input className="form-check-input" type="checkbox" id="centralSwitch" checked={isCentral} onChange={e => setIsCentral(e.target.checked)} />
                  <label className="form-check-label small fw-semibold" htmlFor="centralSwitch">Is Central Government?</label>
                </div>
              </div>
              {!isCentral && (
                <div className="col-md-3">
                  <label className="form-label small fw-semibold">State Name</label>
                  <input type="text" className="form-control" value={stateName} onChange={e => setStateName(e.target.value)} required={!isCentral} placeholder="e.g. Tamil Nadu" />
                </div>
              )}
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Application Deadline</label>
                <input type="date" className="form-control" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Status</label>
                <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="OPENING_SOON">OPENING_SOON</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-myscheme-primary">Publish Scheme</button>
            </div>
          </form>
        </div>
      )}

      {/* Rules Builder Drawer / Dialog */}
      {selectedSchemeId && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content bg-white border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">Rule & Document Configurator</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedSchemeId(null)}></button>
              </div>
              <div className="modal-body">
                {/* Form to Add Eligibility Rule */}
                <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-1 text-success">
                  <BarChart3 size={16} /> Append Eligibility Parameter Rule
                </h6>
                <form onSubmit={handleAddRule} className="mb-4">
                  <div className="row g-2">
                    <div className="col-sm-6">
                      <label className="form-label small">Target Profile Field</label>
                      <select className="form-select form-select-sm" value={ruleFieldName} onChange={e => setRuleFieldName(e.target.value)}>
                        <option value="age">Age</option>
                        <option value="gender">Gender</option>
                        <option value="state">State</option>
                        <option value="annualIncome">Annual Income</option>
                        <option value="occupation">Occupation</option>
                        <option value="caste">Caste</option>
                        <option value="disabilityStatus">Disability Status</option>
                        <option value="isStudent">Student Flag</option>
                        <option value="isFarmer">Farmer Flag</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label small">Operator</label>
                      <select className="form-select form-select-sm" value={ruleOperator} onChange={e => setRuleOperator(e.target.value)}>
                        <option value="GTE">GTE (&gt;=)</option>
                        <option value="LTE">LTE (&lt;=)</option>
                        <option value="EQ">EQ (=)</option>
                        <option value="IN">IN (List: SC,ST)</option>
                        <option value="NEQ">NEQ (!=)</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small">Rule Target Value</label>
                      <input type="text" className="form-control form-control-sm" value={ruleValue} onChange={e => setRuleValue(e.target.value)} placeholder="e.g. 18 or Tamil Nadu or true" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small">Checklist Explanation Message (English)</label>
                      <input type="text" className="form-control form-control-sm" value={ruleMessageEn} onChange={e => setRuleMessageEn(e.target.value)} placeholder="e.g. Age must be at least 18 years" required />
                    </div>
                    <div className="col-12 mt-2">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="criticalCheck" checked={ruleIsCritical} onChange={e => setRuleIsCritical(e.target.checked)} />
                        <label className="form-check-label small" htmlFor="criticalCheck">Is Critical? (Failing disqualifies citizen completely)</label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-sm btn-myscheme-primary mt-3">Add Rule</button>
                </form>

                {/* Form to Add Required Document */}
                <h6 className="fw-bold border-bottom pb-2 mb-3 d-flex align-items-center gap-1 text-success">
                  <FilePlus size={16} /> Append Required Document Checklist
                </h6>
                <form onSubmit={handleAddDocument}>
                  <div className="mb-2">
                    <label className="form-label small">Document Name (English)</label>
                    <input type="text" className="form-control form-control-sm" value={docNameEn} onChange={e => setDocNameEn(e.target.value)} placeholder="e.g. Income Certificate or Aadhaar Card" required />
                  </div>
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="docMandatoryCheck" checked={docIsMandatory} onChange={e => setDocIsMandatory(e.target.checked)} />
                    <label className="form-check-label small" htmlFor="docMandatoryCheck">Is Mandatory document?</label>
                  </div>
                  <button type="submit" className="btn btn-sm btn-myscheme-primary">Add Document</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom management lists (Verification list & Reports list) */}
      <div className="row g-4">
        {/* Schemes Verification Panel */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 bg-white p-4 rounded-4">
            <h4 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <ShieldCheck size={22} className="text-success" />
              Scheme Data Verification & Auditing
            </h4>
            
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle small">
                <thead className="table-light">
                  <tr>
                    <th>Scheme Name</th>
                    <th>Verified Status</th>
                    <th>Audit Status Trigger</th>
                    <th>Configure</th>
                  </tr>
                </thead>
                <tbody>
                  {schemes.map(s => (
                    <tr key={s.id}>
                      <td>
                        <strong>{s.nameEn}</strong>
                        <div className="text-muted" style={{ fontSize: '11px' }}>Category: {s.category} | Views: {s.viewsCount}</div>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${s.verifiedStatus === 'VERIFIED' ? 'bg-success' : s.verifiedStatus === 'NEEDS_REVIEW' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {s.verifiedStatus}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="form-select form-select-sm"
                          value={s.verifiedStatus}
                          onChange={e => handleVerifyScheme(s.id, e.target.value)}
                        >
                          <option value="VERIFIED">VERIFIED</option>
                          <option value="NEEDS_REVIEW">NEEDS REVIEW</option>
                          <option value="EXPIRED">EXPIRED</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-success fw-semibold py-1 px-2" onClick={() => setSelectedSchemeId(s.id)}>
                          Add Rule/Doc
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Reports queue */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 bg-white p-4 rounded-4">
            <h4 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <AlertOctagon size={22} className="text-danger" />
              Citizen Feedback Reports
            </h4>

            {reports.length === 0 ? (
              <p className="text-muted text-center py-4 bg-light border rounded-3">No reports pending audit.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reports.map(r => (
                  <div key={r.id} className="card border p-3 small bg-light rounded-3">
                    <div className="d-flex justify-content-between align-items-start mb-2 border-bottom pb-2">
                      <span className="badge bg-danger">{r.reportType}</span>
                      <span className={`badge ${r.status === 'RESOLVED' ? 'bg-success' : 'bg-warning text-dark'}`}>{r.status}</span>
                    </div>
                    <p className="mb-1"><strong>Scheme:</strong> {r.scheme.nameEn}</p>
                    <p className="mb-2 text-dark font-monospace" style={{ fontSize: '12px' }}>"{r.comments}"</p>
                    
                    {r.status === 'PENDING' && (
                      <button className="btn btn-sm btn-success w-100 d-flex align-items-center justify-content-center gap-1" onClick={() => handleResolveReport(r.id)}>
                        <CheckCircle size={14} />
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
