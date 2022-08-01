import React, { useEffect, useState } from "react"

const UploadFile = () => {
  const [selFile, setSelFile] = useState("")
  const url = "https://preview-gen.herokuapp.com"
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
  

  const addFile = (e) => {
    const file = e.target.files[0]
    setSelFile(file.name)
    const fd = new FormData()
    fd.append("myfile", file)
    fetch(url + "/util/uploadfile", {
      method: "POST",
      body: fd,
    }).then((res) => {
      if (res.status === 200) {
        console.log("file uploaded")

        // apicall
        fetch(apiUrl + "/util/gen-doc-preview", {
          method: "POST",
          body : JSON.stringify({
            url : url + "/" + file.name
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          console.log(res.status);
          res.json().then(({ previewid }) => {
            console.log(previewid);

            fetch(url + "/file/add", {
              method: "POST",
              body: JSON.stringify({
                title: file.name,
                file: file.name,
                thumbnail: previewid,
                createdAt: new Date(),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }).then((res) => {
              console.log(res.status)
            })
          })
        })
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
      return fileData.map(({ _id, title, file, thumbnail, createdAt }) => (
        <tr key={_id}>
          <td>
            <img className="" style={{height : '200px'}} src={apiUrl+'/util/ret-doc-preview/'+thumbnail} alt="" />
          </td>
          <td>{title}</td>
          <td>{file}</td>
          <td>{new Date(createdAt).toLocaleTimeString()}</td>
          {/* <td>
            <button
              className="btn btn-primary"
              onClick={(e) => updateUser({ _id, email, password, username })}
            >
              {" "}
              <i class="fas fa-pencil"></i>{" "}
            </button>
          </td>
          <td>
            <button className="btn btn-danger" onClick={(e) => deleteUser(_id)}>
              <i class="fas fa-trash"></i>
            </button>
          </td> */}
        </tr>
      ));
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

      <table className="table table-dark mt-5">
            <thead>
              <tr>
                <th>Title</th>
                <th>File</th>
                <th>Created on</th>
                {/* <th></th>
                <th></th> */}
              </tr>
            </thead>
            <tbody>{displayUsers()}</tbody>
          </table>
    </div>
  )
}

export default UploadFile
