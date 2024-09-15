import React from "react";
import Topbar from "../Components/Topbar";
import { useNavigate } from "react-router-dom";
const Premium = () => {
  //   const location = useLocation();
  //   useEffect(() => {
  //     const params = new URLSearchParams(location.search);
  //     console.log(params);
  //     const genre = params.get("genre") || "";
  //     console.log(genre);
  //   }, []);
  const navigate = useNavigate();
  const onGenreSelect = (genre) => {
    navigate(`/home?genre=${encodeURIComponent(genre)}`);
  };
  const onSearch = (search) => {
    navigate(`/home?seach=${encodeURIComponent(search)}`);
  };
  return (
    <div>
      <Topbar onGenreSelect={onGenreSelect} onSearch={onSearch} />

      <h1>Coming Soon....</h1>
    </div>
  );
};

export default Premium;
