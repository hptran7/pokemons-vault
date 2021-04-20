import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as BiIcons from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import logo from "../img/Poke_Ball.png"

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
    const MenuList = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Compared",
      url: "/compared",
    },
  ];
  const menuList = MenuList.map(({ url, title }, index) => {
    return (
      <li key={index}>
        <NavLink exact to={url} activeClassName="active">
          {title}
        </NavLink>
      </li>
    );
  });

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav>
      <div >
          <img src={logo} className="logo"></img>
      </div>
      <div className="menu-icon" onClick={handleClick}>
          {clicked?(
              <IoClose size={50}/>
          ):<BiIcons.BiMenu size={50}/>}
        
        
      </div>
      <ul className={clicked ? "menu-list" : "menu-list close"}>{menuList}</ul>
    </nav>
  );
};

export default Navbar;