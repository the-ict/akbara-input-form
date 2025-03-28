import React, { useEffect, useState } from 'react'
import { countries, regions } from "./country"
import Logo from "../public/akbaraImg.jpg"
import WebApp from "@twa-dev/sdk"
import "./index.css"


export default function App() {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState(0)
  const [country, setCountry] = useState("Uzbekistan")
  const [region, setRegion] = useState("Andijon viloyati")
  const [districts, setDistricts] = useState("Andijon")
  const [location, setLocation] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [loading, setLoading] = useState(false)

  const [labels, setLabels] = useState({});


  useEffect(() => {
    if (!location & !name & !lastName) {
      setIsActive(true)
    }
  }, [location, name, lastName])


  useEffect(() => {
    WebApp.ready()

    const languageCode = window.Telegram.WebApp.initDataUnsafe.user?.language_code;

    if (languageCode === "uz") {
      setLabels({
        nameLabel: "Ism",
        lastNameLabel: "Familiya",
        phoneLabel: "Telefon",
        countryLabel: "Davlat",
        regionLabel: "Viloyat",
        districtLabel: "Tuman",
        submitButton: "Yuborish",
        cancelButton: "Bekor qilish",
        namePlaceholder: "Ismni kiriting!",
        lastNamePlaceholder: "Familiyani kiriting",
        phonePlaceholder: "Telefon raqamingiz",
      });
    } else if (languageCode === "en") {
      setLabels({
        nameLabel: "First Name",
        lastNameLabel: "Last Name",
        phoneLabel: "Phone",
        countryLabel: "Country",
        regionLabel: "Region",
        districtLabel: "District",
        submitButton: "Send",
        cancelButton: "Cancel",
        namePlaceholder: "Enter your first name!",
        lastNamePlaceholder: "Enter your last name",
        phonePlaceholder: "Enter your phone number",
        logged: "You already loggedin"
      });
    } else if (languageCode === "ru") {
      setLabels({
        nameLabel: "Имя",
        lastNameLabel: "Фамилия",
        phoneLabel: "Телефон",
        countryLabel: "Страна",
        regionLabel: "Регион",
        districtLabel: "Район",
        submitButton: "Далее",
        cancelButton: "Отменить",
        namePlaceholder: "Введите ваше имя!",
        lastNamePlaceholder: "Введите вашу фамилию",
        phonePlaceholder: "Введите ваш номер телефона",
        logged: "Вы уже зарегистрированы!"
      });
    } else {
      setLabels({
        nameLabel: "Ism",
        lastNameLabel: "Familiya",
        phoneLabel: "Telefon",
        countryLabel: "Davlat",
        regionLabel: "Viloyat",
        districtLabel: "Tuman",
        submitButton: "Keyingisi",
        cancelButton: "Bekor qilish",
        namePlaceholder: "Ismni kiriting!",
        lastNamePlaceholder: "Familiyani kiriting",
        phonePlaceholder: "Telefon raqamingiz",
        logged: "Siz allaqachon ro'yhatdan o'tgansiz"
      });
    }


    const isLoggedIn = async () => {
      if (WebApp.initDataUnsafe.user.id) {
        try {
          await fetch(`https://akbaratvbot.onrender.com/api/user/${WebApp.initDataUnsafe.user.id}`)
            .then(res => res.json())
            .then(res => {
              if (res.user.name) {
                WebApp.close()
              }
            })
            .catch(err => console.log(err))

        } catch (error) {
          alert(`Xatolik yuz berdi. ${error.message}`)
        }
      }
    }

    isLoggedIn()
  }, []);

  const handleSubmit = async () => {

    if (!name || !lastName || !phone || !country) {
      WebApp.showAlert("Iltimos malumotlarni kiriting!")
      return;
    }

    if (country.toLowerCase() == "uzbekistan" && !region || !districts) {
      WebApp.showAlert("Iltimos to'liq malumotni kiriting !")
      return
    }


    try {
      setLoading(true)
      let data = {
        phone,
        name,
        lastName,
        country,
        districts: "",
        region: ""
      }

      if (region.trim() !== "") {
        data.region = region
      }

      if (districts.trim() !== "") {
        data.districts = districts
      }


      if (WebApp.initDataUnsafe.query_id && WebApp.initDataUnsafe.user.id) {
        data.query_id = WebApp.initDataUnsafe.query_id;
        data.user_id = WebApp.initDataUnsafe.user.id
        await fetch("https://akbaratvbot.onrender.com/api/user/web-app", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }).then(() => {
          WebApp.close()
          setLoading(false)
        })
          .catch(err => {
            alert("Yuborishda xatolik yuz berdi")
            setLoading(false)
          })
      } else {
        setLoading(false)
        WebApp.sendData(JSON.stringify(data))
      }

    } catch (error) {
      setLoading(false)
      alert(error)
    }

  };


  const handleCancel = () => {
    WebApp.close()
  }

  return (
    <div className='app'>
      <form className='app-form' onSubmit={(e) => {
        e.preventDefault()
      }}>
        <div className='app-form__content'>
          <a href="/">
            <img src={Logo} alt="akbaraTv.logo" />
          </a>
          <div>
            <label>{labels.nameLabel}</label>
            <input type="text" placeholder={labels.namePlaceholder} onChange={(e) => {
              setName(e.target.value)
            }} />
          </div>
          <div>
            <label>{labels.lastNameLabel}</label>
            <input type="text" placeholder={labels.lastNamePlaceholder} onChange={(e) => {
              setLastName(e.target.value)
            }} />
          </div>
          <div>
            <label>{labels.phoneLabel}</label>
            <input type="number" placeholder={labels.phonePlaceholder} onChange={(e) => {
              setPhone(Number(e.target.value))
            }} />
          </div>
          <div>
            <label className="whiteLabels">{labels.countryLabel}</label>
            <select onChange={(e) => {
              setCountry(e.target.value)
            }} defaultValue="Uzbekistan">
              {
                countries.map((item, index) => {
                  return (
                    <option value={item} key={index}>{item}</option>
                  )
                })
              }
            </select>
          </div>
          {
            country === "Uzbekistan" && (
              <>
                <div>
                  <label className="whiteLabels" style={{ color: "white" }}>{labels.regionLabel}</label>
                  <select onChange={(e) => {
                    setRegion(e.target.value)
                  }} defaultValue="Andijon viloyati">
                    {
                      regions.map((item, index) => (
                        <option value={item.region} key={index}>{item.region}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label style={{ color: "white" }}>{labels.districtLabel}</label>
                  <select onChange={(e) => {
                    setDistricts(e.target.value)
                  }}>
                    {
                      regions.map(item => {
                        if (item.region === region) {
                          return (
                            item.districts.map((dis, _i) => (
                              <option value={dis} key={_i}>{dis}</option>
                            ))
                          )
                        }
                      })
                    }
                  </select>
                </div>
              </>
            )
          }
          <div>
            <label className="whiteLabels" style={{ color: "white" }}>Manzil</label>
            <input type="text" placeholder={"Manzilingizni aniq kiriting!"} onChange={(e) => {
              setLocation(e.target.value)
            }} />
          </div>
          <div className='app-form__buttons'>
            <button onClick={handleCancel}>{labels.cancelButton}</button>
            <button onClick={handleSubmit} style={{
              opacity: isActive ? 1 : 0.6,
              cursor: isActive ? "pointer" : "not-allowed"
            }}>{
                loading ? (
                  <p className="loader"></p>
                ) : (
                  <p>{labels.submitButton}</p>
                )
              }</button>
          </div>
        </div>
      </form>
    </div>
  )
}
