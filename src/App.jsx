import React, { useEffect, useState } from "react";

const App = () => {
  const [domainName, setDomainName] = useState("");
  const [domainNameArr, setDomainNameArr] = useState([]);
  const [domainDataArr, setDomainDataArr] = useState([]);
  // let host = "http://localhost:3000/";
  let host = 'https://whois-backend.vercel.app/'

  useEffect(() => {
    const fetchDataForDomainName = async () => {
      let url = `${host}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (!data) {
        setDomainNameArr([]);
      } else {
        const titles = data.map((obj) => obj.title);
        setDomainNameArr(titles);
      }
    };
    fetchDataForDomainName();

    const fetchDataForDomainData = async () => {
      let url = `${host}domainDataAll`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response.json();
      if (!data) {
        setDomainDataArr([]);
      } else {
        setDomainDataArr(data);
      }
    };
    fetchDataForDomainData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");

    const fetchData = async () => {
      let url = `${host}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: domainName }),
      });
      let note = await response.json();

      if (!domainNameArr.includes(domainName)) {
        setDomainNameArr((prev) => {
          const updatedArray = [domainName, ...prev];
          return updatedArray;
        });
        setDomainDataArr((prev) => {
          const updatedArray = [{ ...note, date: new Date() }, ...prev];
          return updatedArray;
        });
      }
    };
    fetchData();
    setDomainName("");
  };

  const fetchCSVData = () => {
    const fetchData = async () => {
      const response = await fetch(`${host}export-csv`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.blob();

      const url = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "domainData.csv");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    fetchData();
  };

  return (
    <div>
      <div className="container my-4">
        <h3>Whois Domain Lookup</h3>
        <div className="example text-dark-emphasis mb-2"></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="domain"
              className="form-control"
              id="domain"
              pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
              placeholder="Enter Domain Name"
              aria-describedby="emailHelp"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              required
            />
            <div id="emailHelp" className="form-text">
              Some Example &nbsp;
              <span>
                https://getbootstrap.com,&nbsp;&nbsp; https://github.com
              </span>
            </div>
          </div>
          <button type="submit" className="btn btn-dark btn-sm">
            Search 🔍
          </button>
        </form>

        {domainNameArr.length !== 0 && (
          <button onClick={fetchCSVData} className="btn btn-dark btn-sm mt-3">
            Download CSV
          </button>
        )}

        {domainNameArr.length === 0 && (
          <h3 className="mt-5">🔥Please Enter Domain Name for Data Analysis</h3>
        )}

        {domainNameArr.length !== 0 && (
          <>
            <h3 className="mt-3">5 Recent Search Domain</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">DomainName</th>
                  </tr>
                </thead>
                <tbody>
                  {domainNameArr.map((item, idx) => {
                    if (idx > 4) return "";
                    return (
                      <tr key={idx}>
                        <th scope="row">{idx + 1}</th>
                        <td>{item}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {domainDataArr.length !== 0 && (
          <>
            <h3 className="mt-3">
              Some Recent Search Domain Name with it's Details
            </h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">url</th>
                    <th scope="col">domain</th>
                    <th scope="col">updated_date</th>
                    <th scope="col">creation_date</th>
                    <th scope="col">expiration_date</th>
                    <th scope="col">registrar</th>
                    <th scope="col">reg_country</th>
                    <th scope="col">email</th>
                    <th scope="col">date</th>
                  </tr>
                </thead>
                <tbody>
                  {domainDataArr.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <th scope="row">{idx + 1}</th>
                        <td>{item.url}</td>
                        <td>{item.domain}</td>
                        <td>
                          {new Date(item.updated_date).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(item.creation_date).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(item.expiration_date).toLocaleDateString()}
                        </td>
                        <td>{item.registrar}</td>
                        <td>{item.reg_country}</td>
                        <td>{item.email}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
