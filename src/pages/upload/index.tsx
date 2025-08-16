import "./index.css";
import {ScheduleStateContext} from "../../components/outer_page/outer_page"
import Icon from "@mdi/react";
import { mdiUpload } from "@mdi/js";
import { useContext, useRef } from "react";

export function UploadPage() {
  const fileInputRef = useRef(null);

  const [ schedule, setSchedule ] = useContext(ScheduleStateContext);
  // Pretty printed JSON
  const scheduleString = JSON.stringify(schedule, null, 2);

  const uploadButtonCallback = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // open file picker
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // This will validate schema automatically
      setSchedule(parsed);
    } catch (err) {
      console.error("Invalid JSON or schema validation failed:", err);
      alert("❌ Failed to load schedule. Please upload a valid JSON file.");
    }

    // Reset input so user can upload the same file again if needed
    e.target.value = "";
  };

  return (
    <>
      <div className="upload-page-div">
        {/* Hidden file input */}
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Upload button */}
        <div className="button-div" onClick={uploadButtonCallback}>
          <Icon path={mdiUpload} className="button-icon" size={1.5} />
          <h1 className="button-text">Upload Schedule</h1>
        </div>

        {/* JSON pretty view */}
        <h1 className="schedule-label">Current schedule:</h1>
        <pre className="json-viewer">{scheduleString}</pre>
      </div>
    </>
  );
}
