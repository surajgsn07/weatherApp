import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [location, setlocation] = useState("ludhiana");
  const [temperature, settemperature] = useState("-");
  const [humidity, sethumidity] = useState("-");
  const [tempSticker, settempSticker] = useState("-");
  const [condition, setcondition] = useState("-");
  const [conSticker, setconSticker] = useState("-");
  const [wind, setwind] = useState(0)
  const [error, seterror] = useState("")
  const [loader, setloader] = useState(true);

  useEffect(()=>{
    submit();
    if(temperature < 13){
      settempSticker("☃️");
    }else if(temperature > 40){
      settempSticker("🥵");
    }else{
      settempSticker("🌤️");
    }

    if(condition == "rainy"){
      setconSticker("⛈️");
    }else if(condition == "sunny"){
      setconSticker("☀️");
    }else{
      setconSticker("🌥️");
    }


    setInterval(() => {
      setloader(false);
    }, 1000);


    
  },[temperature])

  const submit = async () => {
    const accessKey = import.meta.env.VITE_ACCESS_KEY;
    const url = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=${accessKey}`;
    const data = await fetch(url);
    
    const file = await data.json();
    

    if(!file.data){
      seterror("Too many API calls. Try Again Later");
    }

    console.log(error)

    settemperature(file.data.values.temperature);
    sethumidity(file.data.values.humidity)

    if (file.data.values.rainIntensity > 0) {
      setcondition("Rainy");
    } else if (
      file.data.values.cloudCover < 5 &&
      file.data.values.uvIndex > 5 &&
      file.data.values.temperature >= 15 &&
      file.data.values.temperature <= 25
    ) {
      setcondition("Sunny");
    } else {
      setcondition("Moderate");
    }
    setwind(file.data.values.windSpeed);
  };

  if(loader) return (
    <div
      className={`w-full min-h-screen p-1 sm:p-5 object-cover b flex justify-center items-center text-white`}
    >
      <div className="w-[97%] sm:w-[85%] md:w-[65%] lg:w-[550px]  p-1 sm:p-5 bg-transparent border-l-indigo-100 border-[1px]  rounded-3xl flex justify-center font-semibold">
loading...</div>
    </div>
  )

  if(error !== "") return (
    <div
      className={`w-full min-h-screen p-1 sm:p-5 object-cover  flex justify-center items-center text-white`}
    >
      <div className="w-[97%] sm:w-[85%] md:w-[65%] lg:w-[550px]  p-1 sm:p-5 bg-transparent border-l-indigo-100 border-[1px]  rounded-3xl flex justify-center font-semibold">
{error}</div>
    </div>
  )

  return (
    <div
      className={`w-full min-h-screen p-1 sm:p-5 object-cover  flex justify-center items-center`}
    >
      <div className="w-[97%] sm:w-[85%] md:w-[65%] lg:w-[550px]  p-1 sm:p-5 bg-transparent border-l-indigo-100 border-[1px]  rounded-3xl">


        <div className="w-full p-3">
          <div className="flex justify-center text-white text-2xl gap-4 font-bold font-serif">
            <div className="w-[30px] "><img src="sg.jpg" alt="" /></div>
            <div>
            <span className="text-yellow-500">Weather</span> <span className="text-blue-400">App</span></div>
          </div>
        </div>

        {/* input block */}
        <div className="flex gap-2">
          <input type="text" 
          className="p-2 text-white bg-slate-600 font-semibold rounded-lg w-4/5"
          placeholder="Enter your city..."
          onChange={(e)=>(
            setlocation(e.target.value)
          )}
          value={(location) !== "" ? location :""}
          />
          <button className="bg-white text-black font-semibold py-1 px-3 rounded-xl"
          onClick={submit}
          >Search</button>
        </div>
        
        <div className="w-full text-white p-3">
            <div className="flex justify-between items-center p-3">
              <div className="flex justify-center items-center">
                  <div className="text-lg border-2 rounded-3xl p-2">
                      Temperature : {temperature}° C 
                  </div>
                  <div className="text-lg">
                      {tempSticker}
                  </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="flex justify-center items-center">
                    <div className="text-lg border-2 rounded-3xl p-2">
                        Humidity : {humidity}%
                    </div>
                    <div className="text-lg">
                        💧
                    </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center p-3">
                  <div className="text-lg border-2 rounded-3xl p-2">
                      {condition} 
                  </div>
                  <div className="text-lg">
                      {conSticker}
                  </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="flex justify-center items-center">
                    <div className="text-lg border-2 rounded-3xl p-2">
                        {wind} km/hr
                    </div>
                    <div className="text-lg">
                        💨
                    </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
