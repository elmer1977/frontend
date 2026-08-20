import React, { useEffect } from "react";
import { AiOutlineBell, AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { backend_url } from "../../../server";
import { getAllOrdersOfShop } from "../../../redux/actions/order";

const DashboardHeader = () => {
    const dispatch = useDispatch();
    const { seller } = useSelector((state) => state.seller);
    const { orders } = useSelector((state) => state.order);

    useEffect(() => {
        if (seller && seller._id) {
            dispatch(getAllOrdersOfShop(seller._id));
        }
    }, [dispatch, seller]);

    const notificationCount = orders
        ? orders.filter((order) => order.status !== "Processing").length
        : 0;

    return (
        <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
            <div>
                <Link to="/dashboard">
                    <img
                        src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                        alt=""
                    />
                </Link>
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <Link to="/dashboard/cupouns" className="800px:block hidden">
                        <AiOutlineGift
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-events" className="800px:block hidden">
                        <MdOutlineLocalOffer
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-products" className="800px:block hidden">
                        <FiShoppingBag
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to="/dashboard-orders" className="800px:block hidden">
                        <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
                    </Link>
                    <Link to="/dashboard-orders" className="800px:block hidden relative">
                        <AiOutlineBell color="#555" size={30} className="mx-5 cursor-pointer" />
                        {notificationCount > 0 ? (
                            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#3bc177] px-1.5 text-[12px] text-white">
                                {notificationCount}
                            </span>
                        ) : null}
                    </Link>
                    <Link to="/dashboard-messages" className="800px:block hidden">
                        <BiMessageSquareDetail
                            color="#555"
                            size={30}
                            className="mx-5 cursor-pointer"
                        />
                    </Link>
                    <Link to={`/shop/${seller._id}`}>
                        <img
                            src={`${backend_url}${seller.avatar}`}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;