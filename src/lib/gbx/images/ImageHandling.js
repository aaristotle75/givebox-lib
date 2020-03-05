const API_URL = process.env.REACT_APP_API_URL;

export function handleFile(file, callback, progressCallback) {

  const x = new XMLHttpRequest();
	x.onload = function() {
		if (this.status !== 200 || !this.response) {
			if (callback) callback(null);
			return;
		}
		const s3 = JSON.parse(this.response);
		blob2S3(file, s3, file.name, callback, progressCallback);
	}
	const endpoint = `${API_URL}s3/upload-form?name=${file.name}&mime=${file.type}`
	x.open('GET', endpoint);
	x.withCredentials = true;
	x.send();
}

export function blob2S3(
  file,
  s3,
  fileName,
  callback,
  progressCallback
) {
	const formData = new FormData();
	for (var name in s3.fields) {
		formData.append(name, s3.fields[name]);
	}
	formData.append('file', file, fileName);
	var x = new XMLHttpRequest();

  if (progressCallback) {
    x.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        progressCallback(percentLoaded);
      }
    }
  }

	x.onload = function() {
		if (this.status !== 204) {
    	if (callback) {
  			callback(null);
  		}
			return;
		}
  	if (callback) {
			callback(x.getResponseHeader('Location'));
		}
	}
	x.open(s3.method, s3.action);
	x.send(formData);
}
