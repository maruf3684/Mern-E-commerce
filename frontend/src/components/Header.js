import React, { useRef } from "react";
import { MdAddShoppingCart, MdHighlightOff,MdFlashOn ,MdOutlineMenu} from "react-icons/md";
import Avatar from "react-avatar";

const Header = () => {
    const element = useRef(null);
    const clickHandler=(e)=>{
        console.log("jj");
        element.current.classList.toggle('hidden');
    }
	return (
		<div className="relative">
			<header className="flex justify-between bg-white px-5">
                  <div className="block p-4  text-3xl cursor-pointer  md:hidden" onClick={clickHandler}>
                     <MdOutlineMenu/>
                  </div>
				<div className="hidden md:block">
					<li className="flex gap-7 items-center ">
						<ul className="text-5xl text-fuchsia-600 cursor-pointer p-2">
							<h1 className="flex justify-center"> <MdFlashOn className="animate-pulse"/> <span>MRX</span> </h1>
						</ul>
						<ul className=" cursor-pointer font-semibold p-2 hover:bg-fuchsia-600 hover:text-white rounded-md">
							Home
						</ul>
						<ul className=" cursor-pointer font-semibold  p-2 hover:bg-fuchsia-600 hover:text-white  rounded-md">
							Contact
						</ul>
					</li>
				</div>

				<div>
					<ul className="flex gap-7 items-center">
						<li className="p-2" >
							<MdAddShoppingCart className="text-3xl cursor-pointer" />
						</li>
						<li className="p-2">
							<Avatar
								name="Wim Mostmans"
								size="40"
								round="100px"
								src="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3"
								className="cursor-pointer"
							/>
						</li>
					</ul>
				</div>
			</header>

			<div ref={element} className=" absolute top-0 left-0 h-screen w-72 z-10 bg-white hidden md:hidden">
				<div className="relative">
					<h1 className="text-5xl cursor-pointer text-fuchsia-600 p-5 text-center">
						MRX
					</h1>
					<ul>
						<li className=" hover:text-white hover:bg-slate-400 cursor-pointer text-center border-t-2 p-4">
							Home
						</li>
						<li className=" hover:text-white hover:bg-slate-400 cursor-pointer text-center border-t-2 border-b-2 p-4">
							Contact
						</li>
					</ul>

					<div className=" hover:text-white absolute top-2 right-0 p-2 cursor-pointer text-2xl bg-slate-300 rounded-full ">
						<MdHighlightOff onClick={clickHandler} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
