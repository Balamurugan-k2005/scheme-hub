import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Save, User, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const { t } = useLanguage();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  const [caste, setCaste] = useState('');
  const [disabilityStatus, setDisabilityStatus] = useState(false);
  const [disabilityDetails, setDisabilityDetails] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [isFarmer, setIsFarmer] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setAge(profile.age ?? '');
      setGender(profile.gender ?? '');
      setState(profile.state ?? '');
      setDistrict(profile.district ?? '');
      setAnnualIncome(profile.annualIncome ?? '');
      setOccupation(profile.occupation ?? '');
      setEducation(profile.education ?? '');
      setCaste(profile.caste ?? '');
      setDisabilityStatus(profile.disabilityStatus ?? false);
      setDisabilityDetails(profile.disabilityDetails ?? '');
      setFamilyMembers(profile.familyMembers ?? '');
      setIsFarmer(profile.isFarmer ?? false);
      setIsStudent(profile.isStudent ?? false);
      setIsBusinessOwner(profile.isBusinessOwner ?? false);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await updateProfile({
        age: age === '' ? undefined : Number(age),
        gender,
        state,
        district,
        annualIncome: annualIncome === '' ? undefined : Number(annualIncome),
        occupation,
        education,
        caste,
        disabilityStatus,
        disabilityDetails: disabilityStatus ? disabilityDetails : '',
        familyMembers: familyMembers === '' ? undefined : Number(familyMembers),
        isFarmer,
        isStudent,
        isBusinessOwner,
      });
      setMessage('Profile updated successfully! New scheme recommendations have been calculated.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const states = ["Andhra Pradesh", "Karnataka", "Kerala", "Maharashtra", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
  const occupations = ["STUDENT", "FARMER", "BUSINESS", "UNEMPLOYED", "RETIRED", "OTHER"];
  const educations = ["BELOW_MATRIC", "MATRIC", "HIGHER_SECONDARY", "GRADUATE", "POST_GRADUATE"];
  const castes = ["GENERAL", "OBC", "SC", "ST"];

  return (
    <div className="container py-5" style={{ maxWidth: '850px' }}>
      <div className="card shadow-sm border-0 bg-white p-4 p-md-5 rounded-4">
        <div className="d-flex align-items-center gap-3 border-bottom pb-4 mb-4">
          <div className="bg-success text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', backgroundColor: '#15803d' }}>
            <User size={28} />
          </div>
          <div>
            <h2 className="fw-bold text-dark mb-0">Citizen Eligibility Profile</h2>
            <p className="text-muted small mb-0">
              Keep your demographic parameters up to date to get 100% accurate matching welfare recommendations.
            </p>
          </div>
        </div>

        {message && (
          <div className="alert alert-success d-flex align-items-center gap-2 p-3 small mb-4 rounded-3">
            <CheckCircle2 size={18} className="text-success" />
            <span>{message}</span>
          </div>
        )}
        {error && <div className="alert alert-danger p-3 small mb-4 rounded-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <h6 className="fw-bold text-success text-uppercase small letter-spacing-1 mb-2">
                1. Basic Demographics
              </h6>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Age (in years)</label>
              <input 
                type="number" 
                className="form-control" 
                value={age} 
                onChange={e => setAge(e.target.value !== '' ? Number(e.target.value) : '')} 
                min="0" 
                max="120"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Gender</label>
              <select className="form-select" value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="TRANSGENDER">Transgender</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">State / Union Territory</label>
              <select className="form-select" value={state} onChange={e => setState(e.target.value)} required>
                <option value="">Select State</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">District</label>
              <input 
                type="text" 
                className="form-control" 
                value={district} 
                onChange={e => setDistrict(e.target.value)} 
                placeholder="e.g. Chennai, Madurai, Coimbatore"
                required
              />
            </div>

            <div className="col-12 mt-4">
              <h6 className="fw-bold text-success text-uppercase small letter-spacing-1 mb-2">
                2. Financial & Social Category
              </h6>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Annual Family Income (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                value={annualIncome} 
                onChange={e => setAnnualIncome(e.target.value !== '' ? Number(e.target.value) : '')} 
                min="0"
                placeholder="e.g. 200000"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Family Household Size (Members)</label>
              <input 
                type="number" 
                className="form-control" 
                value={familyMembers} 
                onChange={e => setFamilyMembers(e.target.value !== '' ? Number(e.target.value) : '')} 
                min="1"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Social Category (Caste Group)</label>
              <select className="form-select" value={caste} onChange={e => setCaste(e.target.value)} required>
                <option value="">Select Category</option>
                {castes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Highest Education Level</label>
              <select className="form-select" value={education} onChange={e => setEducation(e.target.value)} required>
                <option value="">Select Education</option>
                {educations.map(ed => <option key={ed} value={ed}>{ed}</option>)}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold">Primary Occupation</label>
              <select className="form-select" value={occupation} onChange={e => setOccupation(e.target.value)} required>
                <option value="">Select Occupation</option>
                {occupations.map(oc => <option key={oc} value={oc}>{oc}</option>)}
              </select>
            </div>

            {/* Disability Toggle */}
            <div className="col-md-12 my-3">
              <div className="form-check form-switch p-3 bg-light rounded-3 border">
                <input 
                  className="form-check-input ms-0 me-3" 
                  type="checkbox" 
                  id="disabilitySwitch"
                  checked={disabilityStatus}
                  onChange={e => setDisabilityStatus(e.target.checked)}
                />
                <label className="form-check-label small fw-bold text-dark" htmlFor="disabilitySwitch">
                  Person with Benchmark Disability (Divyangjan)?
                </label>
              </div>
            </div>

            {disabilityStatus && (
              <div className="col-md-12 mb-3">
                <label className="form-label small fw-semibold">Disability Type / Percentage Details</label>
                <textarea 
                  className="form-control" 
                  value={disabilityDetails} 
                  onChange={e => setDisabilityDetails(e.target.value)}
                  rows={2}
                  placeholder="e.g. Locomotor Disability 40%+"
                  required={disabilityStatus}
                />
              </div>
            )}

            {/* Verification Sub-statuses */}
            <div className="col-md-12 border-top pt-3 my-3">
              <h6 className="fw-bold text-success text-uppercase small letter-spacing-1 mb-3">
                3. Verification Sub-Statuses
              </h6>
              <div className="d-flex flex-wrap gap-4">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="farmerCheck" 
                    checked={isFarmer}
                    onChange={e => setIsFarmer(e.target.checked)}
                  />
                  <label className="form-check-label small fw-semibold" htmlFor="farmerCheck">
                    Agricultural Farmer / Landholder
                  </label>
                </div>

                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="studentCheck" 
                    checked={isStudent}
                    onChange={e => setIsStudent(e.target.checked)}
                  />
                  <label className="form-check-label small fw-semibold" htmlFor="studentCheck">
                    Currently Enrolled Student
                  </label>
                </div>

                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="businessCheck" 
                    checked={isBusinessOwner}
                    onChange={e => setIsBusinessOwner(e.target.checked)}
                  />
                  <label className="form-check-label small fw-semibold" htmlFor="businessCheck">
                    Micro / Small Enterprise Owner
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-myscheme-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm">
              <Save size={18} />
              Save Profile Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
