import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css"; // 스타일 추가

// 메인 페이지 (경험 목록)
function Home({ experiences, setExperiences }) {
  const navigate = useNavigate();

  // 경험 삭제 함수
  const handleDeleteExperience = (index) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const updatedExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(updatedExperiences);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>📌 경험 정리 웹페이지</h1>
      <button onClick={() => navigate("/add")}>새 경험 추가하기</button>

      {/* 경험 목록 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "20px" }}>
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            style={{ border: "1px solid gray", padding: "10px", position: "relative", cursor: "pointer" }}
            onClick={() => navigate(`/edit/${index}`)}
          >
            <h3>{exp.title}</h3>
            <p>📅 시기: {exp.date}</p>
            <p>📌 기간: {exp.duration}</p>
            <p>📝 요약: {exp.summary}</p>
            <p>🔍 키워드: {exp.keywords}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); handleDeleteExperience(index); }} 
              style={{ position: "absolute", top: "5px", right: "5px", background: "red", color: "white", border: "none", cursor: "pointer" }}
            >❌</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 경험 추가 & 수정 페이지
function ExperienceForm({ experiences, setExperiences, isEditing, editingIndex }) {
  const navigate = useNavigate();
  const existingExperience = isEditing ? experiences[editingIndex] : null;

  const [formData, setFormData] = useState(existingExperience || {
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    duration: "",
    summary: "",
    details: "",
    keywords: "",
    notes: ""
  });

  // 입력값 변경 처리
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 저장 버튼 클릭 시 실행
  const handleSave = () => {
    const newExperience = {
      ...formData,
      date: `${formData.startDate.toISOString().split("T")[0]} ~ ${formData.endDate.toISOString().split("T")[0]}`
    };

    if (isEditing) {
      const updatedExperiences = experiences.map((exp, index) => index === editingIndex ? newExperience : exp);
      setExperiences(updatedExperiences);
    } else {
      setExperiences([...experiences, newExperience]);
    }

    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{isEditing ? "경험 수정" : "새 경험 추가"}</h1>
      <input type="text" name="title" placeholder="제목" value={formData.title} onChange={handleChange} /><br />
      
      {/* 달력 (시작일 - 종료일) */}
      <label>시작일: </label>
      <DatePicker 
        selected={formData.startDate} 
        onChange={(date) => setFormData({ ...formData, startDate: date })} 
        dayClassName={(date) => date.getMonth() === new Date().getMonth() ? "current-month" : "next-month"}
      /><br />
      
      <label>종료일: </label>
      <DatePicker 
        selected={formData.endDate} 
        onChange={(date) => setFormData({ ...formData, endDate: date })} 
        dayClassName={(date) => date.getMonth() === new Date().getMonth() ? "current-month" : "next-month"}
      /><br />

      <input type="text" name="duration" placeholder="기간" value={formData.duration} onChange={handleChange} /><br />
      
      {/* 요약 칸 줄이고, 세부내용 칸 늘림 */}
      <textarea name="summary" placeholder="요약" value={formData.summary} onChange={handleChange} style={{ width: "80%", height: "100px" }} /><br />
      <textarea name="details" placeholder="세부내용" value={formData.details} onChange={handleChange} style={{ width: "80%", height: "300px" }} /><br />

      {/* 키워드 & 비고 칸을 세부내용 크기만큼 늘림 */}
      <input type="text" name="keywords" placeholder="키워드" value={formData.keywords} onChange={handleChange} style={{ width: "80%" }} /><br />
      <input type="text" name="notes" placeholder="비고" value={formData.notes} onChange={handleChange} style={{ width: "80%" }} /><br />

      <button onClick={handleSave}>저장</button>
      <button onClick={() => navigate("/")}>취소</button>
    </div>
  );
}

// App.js (전체 라우팅 관리)
function App() {
  const [experiences, setExperiences] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home experiences={experiences} setExperiences={setExperiences} />} />
        <Route path="/add" element={<ExperienceForm experiences={experiences} setExperiences={setExperiences} isEditing={false} />} />
        <Route path="/edit/:index" element={<ExperienceEdit experiences={experiences} setExperiences={setExperiences} />} />
      </Routes>
    </Router>
  );
}

// 수정 페이지를 위한 컴포넌트
function ExperienceEdit({ experiences, setExperiences }) {
  const navigate = useNavigate();
  const index = parseInt(window.location.pathname.split("/").pop(), 10);
  return <ExperienceForm experiences={experiences} setExperiences={setExperiences} isEditing={true} editingIndex={index} />;
}

export default App;
