import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import Button from "../components/Button"
const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/login");
      }
      const { data } = await axios.post(
        "http://localhost:4000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/login"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/");
        setNotes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  async function addNote(newNote) {
    try {
      const response = await axios.post("http://localhost:4000/add", newNote);
      setNotes((prevNotes) => [...prevNotes, response.data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNote(id) {
    try {
      await axios.delete(`http://localhost:4000/delete/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
       <div>
      <Header />
      <div className="home_page" style={{height: '250px'}}>
        <h4 className="welcome">
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <Button name="Log Out" Logout={Logout}/>
      </div>
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => (
        <Note
          key={noteItem._id}
          id={noteItem._id}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
    </>
  );
};

export default Home;