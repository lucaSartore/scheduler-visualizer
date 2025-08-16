import {
	schedule,
	setSchedule,
} from "../../components/schedule_state/schedule_state";
import { TopBar } from "../../components/top_bar/top_bar";
import "index.css";

import Icon from '@mdi/react';
import { mdiUpload } from '@mdi/js';

// this is a function that take as inp

export function UploadPage() {
  
	var scheduleString = JSON.stringify(schedule);

  var uploadButtonCallback = () => {
    // here you should upload a json file, and then call
    // setSchedule.
    // the function validate the schema using zoo and if 
    // fails then you should print an error
  }
	return (
		<>
			<div className="upload-page-div">
				<TopBar />


				<div className="button-div" onClick={uploadButtonCallback} >
					<Icon path={mdiUpload} className="button-icon" />
          <h1 className="button-text">Upload Schedule</h1>
				</div>
      
        <pre> // i would like for this to be a "pretty" visualization of the schedule json
          {scheduleString}
        </pre>
			</div>
		</>
	);
}
