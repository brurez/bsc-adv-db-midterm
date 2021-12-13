import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "bulma/css/bulma.css";

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const colors = [
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
  randomColor(),
];

function BarPlot(props) {
  const max = props.items.reduce(
    (acc, item) => (item.value > acc ? item.value : acc),
    0
  );
  return (
    <svg viewBox="0 0 50 15" xmlns="http://www.w3.org/2000/svg">
      {props.items.map((item, index) => {
        const height = (15 * item.value) / max;
        return (
          <>
            <rect
              x={index * 5}
              y={15 - height}
              width="4"
              height={height}
              fill={colors[index]}
              rx="1"
            />
            <text fontSize={1} x={index * 5 + 0.5} y={13.5}>
              {item.label}
            </text>
            <text fontSize={1} x={index * 5 + 0.5} y={14.5}>
              {item.value}
            </text>
          </>
        );
      })}
    </svg>
  );
}

function App() {
  const [musics, setMusics] = useState([]);
  const [offset, setOffset] = useState(0);
  const [orderBy, setOrderBy] = useState("title");
  const [loading, setLoading] = useState(false);
  const [topComposers, setTopComposers] = useState([]);
  const [topCountries, setTopCountries] = useState([]);

  function fetchMusics() {
    setLoading(true);
    axios.get(`/api/musics?offset=${offset}&orderBy=${orderBy}`).then((res) => {
      setMusics([...musics, ...res.data]);
      setLoading(false);
    });
  }

  function fetchAggregationData() {
    axios.get("/api/top-composers").then((res) => {
      setTopComposers(res.data);
    });
    axios.get("/api/top-countries").then((res) => {
      setTopCountries(res.data);
    });
  }

  function handleLoadMoreClick() {
    setOffset(offset + 10);
    fetchMusics();
  }

  useEffect(() => {
    fetchMusics();
    fetchAggregationData();
  }, []);

  return (
    <div className="App has-background-light">
      <div className="container">
        <h1 className="is-size-2">Midterm App</h1>

        <h2 className="is-size-3">Information using aggregate functions</h2>
        <div className="box p-6">
          <h3 className="is-size-4 mt-4">Top 10 composers by music count</h3>
          <BarPlot items={topComposers} />
        </div>
        <div className="box p-6">
          <h3 className="is-size-4 mt-4">Top 10 countries by music count</h3>
          <BarPlot items={topCountries} />
        </div>

        <h2 className="is-size-3">All musics</h2>

        <div className="box">
          <table
            className={`table mx-auto ${loading ? "is-loading" : ""}`}
          >
            <thead>
              <tr>
                <th>
                  <abbr title="Title">Title</abbr>
                </th>
                <th>
                  <abbr title="Composer lastname">Composer</abbr>
                </th>
                <th>
                  <abbr title="Catalogue Number">Cat. Num.</abbr>
                </th>
                <th>
                  <abbr title="Date">Date</abbr>
                </th>
                <th>
                  <abbr title="Key">Key</abbr>
                </th>
                <th>
                  <abbr title="Modulation">Modulation</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {musics.map((music) => (
                <tr key={music.id}>
                  <th>{music.title}</th>
                  <th>{music.lastname}</th>
                  <th>{music.catalogue_number}</th>
                  <th>
                    {music.date_exact
                      ? music.date_exact
                      : music.date_range_start + " - " + music.date_range_end}
                  </th>
                  <th>{music.key}</th>
                  <th>{music.modulation}</th>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="button mb-4 is-primary"
            onClick={handleLoadMoreClick}
          >
            Load more
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
