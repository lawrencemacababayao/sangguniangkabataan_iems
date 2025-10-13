import { useEffect } from "react";
import bgImage from "../assets/ChatGPT Image Oct 11, 2025, 02_38_22 PM.png";
import logoImage from "../assets/skkkk.png"
import { useNavigate } from "react-router-dom";  //hook for navigating between pages 
import "../media/start.css"

const Startt = () => {

    const navigate = useNavigate();

const handleYouthClick = () => {
    navigate("/youthlogin");
    };

    useEffect(() => {
    document.title = "Welcome | Sangguniang Kabataan";
    }, []);

  return (
    <div className="relative w-screen h-screen bg-cover bg-top" style={{backgroundImage: `url(${bgImage})`,}}>
      {/* Optional overlay (for dark filter) */}

      {/* content layer */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <form className='form bg-[#F3F1FF]/70 pt-5 mt-0 rounded-2xl shadow-xl w-full max-w-md h-135 flex flex-col items-center '>
          <div className='w-3/4 min-h-1/4 flex justify-center'><img src={logoImage} alt="" className=' w-1/2 object-cover'/></div>
          <h3 className='starttext1 text-2xl font-medium'>SANGGUNIANG</h3>
          <h1 className='starttext2 text-5xl font-bold'>KABATAAN</h1>

          <button onClick={handleYouthClick} className='btn1 bg-[#0049B1] p-1 w-1/2 mt-15 rounded-xl text-white h-12 cursor-pointer text-xl flex justify-center items-center gap-2'><span className="material-icons-outlined  text-50 text-white font-thin">person</span>YOUTH</button>
          <button className='btn2 bg-[#0049B1] p-1 mt-10 w-1/2 rounded-xl text-white h-12 cursor-pointer text-xl flex justify-center items-center gap-2'><span className="material-icons-outlined  text-50 text-white font-thin">manage_accounts</span>ADMIN</button>
        </form>
      </div>
    </div>
  )
}

export default Startt
