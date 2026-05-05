import React from 'react'
import '../style/home.scss'

const Home = () => {
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