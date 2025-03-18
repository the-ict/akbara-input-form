import React, { useEffect, useState } from 'react'
import { countries, regions } from "./country"
import Logo from "../public/akbaraImg.jpg"
import axios from "axios"
import "./index.css"


export default function App() {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState(0)
  const [country, setCountry] = useState("Uzbekistan")
  const [region, setRegion] = useState("Andijon viloyati")
  const [districts, setDistricts] = useState("")
  const [location, setLocation] = useState("")
  const [isActive, setIsActive] = useState(false)

  // Tilga moslashtirilgan matnlar
  const [labels, setLabels] = useState({});


  useEffect(() => {
    if (!country & !region & !location & !name & !lastName & !districts) {
      setIsActive(true)
    }
  }, [location, name, lastName])


  useEffect(() => {
    const languageCode = window.Telegram.WebApp.initDataUnsafe.user?.language_code;

    if (languageCode === "uz") {
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
      });
    } else if (languageCode === "en") {
      setLabels({
        nameLabel: "First Name",
        lastNameLabel: "Last Name",
        phoneLabel: "Phone",
        countryLabel: "Country",
        regionLabel: "Region",
        districtLabel: "District",
        submitButton: "Next",
        cancelButton: "Cancel",
        namePlaceholder: "Enter your first name!",
        lastNamePlaceholder: "Enter your last name",
        phonePlaceholder: "Enter your phone number",
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

      });
    }
    window.Telegram.WebApp.ready()
  }, []);

  const handleSubmit = async () => {
    if (!name || !lastName || !phone || !country) {
      alert("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    const query_id = window?.Telegram?.WebApp.initDataUnsafe?.query_id

    if (query_id) {
      try {
        await axios.post("https://akbaratvbot.onrender.com/web-app", {
          query_id: query_id,
          name,
          lastName,
          phone,
          country,
          region,
          districts,
          user_id: window?.Telegram?.WebApp?.initDataUnsafe?.user?.id
        })

        alert("Jo'natildi !")

      } catch (error) {
        console.log(error)
      }
    } else {
      alert("Query Mavjud emas!")
    }

  };


  const handleCancel = () => {
    window.Telegram.WebApp.close()
  }

  return (
    <div className='app'>
      <form className='app-form' onSubmit={(e) => {
        e.preventDefault()
      }} style={{
        backgroundColor: window.Telegram.WebApp.themeParams.bg_color && window.Telegram.WebApp.themeParams.bg_color,
        color: window.Telegram.WebApp.themeParams.text_color && window.Telegram.WebApp.themeParams.text_color
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
            }}>{labels.submitButton}</button>
          </div>
        </div>
      </form>
    </div>
  )
}
