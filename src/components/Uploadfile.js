import React, { useEffect, useState } from "react"

const UploadFile = () => {
  const [selFile, setSelFile] = useState("")
  // const url = "https://Hosted_preview_backend.com"
  const url = "https://preview-demo-backend.herokuapp.com"
  const apiUrl = "http://localhost:4000";

  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState([]);

  const getDataFromBackend = () => {
    setLoading(true)
    fetch(url+'/file/getall')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setFileData(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    getDataFromBackend();
  }, [])

  const deleteFile = (id) => {
    fetch(url+'/file/delete/'+id, {method : 'DELETE'})
    .then(res => res.json())
    .then(data => {
      console.log(data);
      getDataFromBackend();
    })
  }
  
  const genFilePreview = (saveFile, filename) => {
    fetch(apiUrl + "/util/gen-doc-preview", {
      method: "POST",
      body : JSON.stringify({
        url : url + "/" + filename
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res.status);
      res.json().then(({ previewid }) => {
        console.log(previewid);

        saveFile(previewid);
        
      })
    })
  }

  const genVideoPreview = (saveFile, filename) => {
    fetch(apiUrl + "/util/gen-vid-preview", {
      method: "POST",
      body : JSON.stringify({
        url : url + "/" + filename
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res.status);
      res.json().then(({ previewid }) => {
        console.log(previewid);
        saveFile(previewid);
      })
    })
  }

  const addFile = (e) => {
    const file = e.target.files[0]
    console.log(file.type.startsWith('video'));
    setSelFile(file.name)
    console.log();
    const fd = new FormData()
    fd.append("myfile", file)
    fetch(url + "/util/uploadfile", {
      method: "POST",
      body: fd,
    }).then((res) => {
      if (res.status === 200) {
        console.log("file uploaded")

        // apicall
        if(file.type.startsWith('video')){
          genVideoPreview((previewid) => {
            fetch(url + "/file/add", {
              method: "POST",
              body: JSON.stringify({
                title: file.name,
                file: file.name,
                type : file.type,
                thumbnail: previewid,
                createdAt: new Date(),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              console.log(res.status);
              // setTimeout(() => {
              //   setLoading(true);
              //   getDataFromBackend();
              // }, 10000);
            })
          }, file.name)
        }else{
          genFilePreview((previewid) => {
            fetch(url + "/file/add", {
              method: "POST",
              body: JSON.stringify({
                title: file.name,
                file: file.name,
                type : file.type,
                thumbnail: previewid,
                createdAt: new Date(),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              console.log(res.status);
              setTimeout(() => {
                setLoading(true);
                getDataFromBackend();
              }, 3000);
            })
          }, file.name)
        }
      }
    })
  }

  const displayUsers = () => {
    if (loading) {
      return (
        <div class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    } else {
      return <table className="table table-dark mt-5">
      <thead>
        <tr>
          <th>Title</th>
          <th>File</th>
          <th>Created on</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {fileData.map(({ _id, title, file,type, thumbnail, createdAt }) => (
        <tr key={_id}>
          <td>
            {type.startsWith('video')
            ?
            <img className="" style={{height : '200px'}} src={apiUrl+'/util/ret-vid-preview/'+thumbnail} alt="" />
            :
            <img className="" style={{height : '200px'}} src={apiUrl+'/util/ret-doc-preview/'+thumbnail} alt="" />
          }
          </td>
          <td>{title}</td>
          <td>{file}</td>
          <td>{new Date(createdAt).toLocaleTimeString()}</td>
          <td>
            <button className="btn btn-danger" onClick={(e) => deleteFile(_id)}>
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      ))}
        </tbody>
    </table>
      
    }
  };

  const getPreview = (e) => {
    const file = e.target.files[0]
    setSelFile(file.name)
    const fd = new FormData()
    fd.append("myfile", file)
    fetch(url + "/util/gen-preview", {
      method: "POST",
      body: fd,
    }).then((res) => {
      if (res.status === 200) {
        console.log("file uploaded")
        res.json().then((data) => {
          console.log(data)
        })
      }
    })
  }

  return (
    <div className="container">
      <h1>File Uploader</h1>
      <hr />

      <div className="card">
        <div className="row">
          <h3> File Upload</h3>
          <div className="form-group">
            <input type="file" onChange={addFile} />
          </div>

          {/* <label>Generate Preview</label>
          <input type="file" onChange={getPreview} /> */}

          <div className="form-group mt-2">
            <button className="btn btn-primary" type="submit">
              Upload
            </button>
          </div>
        </div>
      </div>

      
              {displayUsers()}
    </div>
  )
}

export default UploadFile
