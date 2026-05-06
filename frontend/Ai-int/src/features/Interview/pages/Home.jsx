import React from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview'
import { useState } from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router'

const Home = () => {
  const { loading, generateReport } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeRef = useRef();
  const navigate = useNavigate();

  const handleGenerateReport = () => {
    const resumeFile = resumeRef.current.files[0];
    generateReport({resumeFile, jobDescription, selfDescription});
    const data = await generateReport({resumeFile, jobDescription, selfDescription});
    navigate(`/report/${data.interviewReport._id}`);
  }

  if (loading) {
    return (<main><h1>Loading...</h1></main>);
  }
  return ( 
    <main className='home'>
        <div className="left">
            <textarea name="job description" id="jobdescription" placeholder='Enter job description'></textarea>
        </div>
        <div className="right">
            <div className="input-gropup">
                <label htmlFor="resume">Upload resume</label>
                <input type="file" name="resume" id="resume" accept='.pdf' />
            </div>
            <div className="input-gropup">
                <label htmlFor="selfDescription">self description</label>
                <textarea name="selfDescription" id="selfDescription" placeholder='Describe yourself in a few sentences...'></textarea>
            </div>
            <button className='generate-btn'>Generate Report</button>
        </div>
    </main>
   )
}

export default Home