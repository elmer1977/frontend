import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllSellers } from "../../redux/actions/sellers";
import { Link } from "react-router-dom";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  // New states for search and edit
  const [searchQuery, setSearchQuery] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipcode] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(getAllSellers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Delete failed");
      });

    dispatch(getAllSellers());
  };

  const refresh = () => dispatch(getAllSellers());

  const handleOpenEdit = (row) => {
    const sellerObj = sellers && sellers.find((s) => s._id === row.id || s._id === row._id || s.id === row.id);
    if (!sellerObj) {
      toast.error("Seller data not available");
      return;
    }
    setSelectedSeller({ id: sellerObj._id });
    setName(sellerObj.name || "");
    setEmail(sellerObj.email || "");
    setAddress(sellerObj.address || "");
    setPhoneNumber(sellerObj.phoneNumber || "");
    setZipcode(sellerObj.zipCode || "");
    setDescription(sellerObj.description || "");
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (!selectedSeller || !selectedSeller.id) return;

    try {
      const { data } = await axios.put(
        `${server}/shop/admin-update-seller/${selectedSeller.id}`,
        {
          name,
          email,
          address,
          phoneNumber,
          zipCode,
          description,
        },
        { withCredentials: true }
      );
      toast.success(data.message || "Seller updated successfully");
      setOpenEdit(false);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "address",
      headerName: "Seller Address",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "joinedAt",
      headerName: "Joined At",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "edit",
      flex: 0.6,
      minWidth: 120,
      headerName: "Edit",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleOpenEdit(params.row)}>
          <AiOutlineEdit size={18} />
        </Button>
      ),
    },
    {
      field: "preview",
      flex: 0.6,
      minWidth: 120,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/shop/preview/${params.id}`}>
          <Button>
            <AiOutlineEye size={18} />
          </Button>
        </Link>
      ),
    },
    {
      field: "delete",
      flex: 0.6,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => setUserId(params.id) || setOpen(true)}>
          <AiOutlineDelete size={18} />
        </Button>
      ),
    },
  ];

  const rows = [];
  sellers &&
    sellers.forEach((item) => {
      rows.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        joinedAt: item.createdAt ? item.createdAt.slice(0, 10) : "",
        address: item.address || "",
      });
    });

  const filteredRows = rows.filter((item) =>
    [item.name, item.email, item.address]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-4">
          <h3 className="text-[22px] font-Poppins">All Sellers</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sellers..."
              className="px-3 py-2 border border-gray-300 rounded w-full sm:w-64"
            />
          </div>
        </div>

        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid rows={filteredRows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
        </div>

        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">Are you sure you want to delete this seller?</h3>
              <div className="w-full flex items-center justify-center">
                <div className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`} onClick={() => setOpen(false)}>
                  cancel
                </div>
                <div className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`} onClick={() => setOpen(false) || handleDelete(userId)}>
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}

n        {openEdit && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpenEdit(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">Edit Seller</h3>
              <div className="space-y-4">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded" />
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="w-full px-3 py-2 border border-gray-300 rounded" />
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" className="w-full px-3 py-2 border border-gray-300 rounded" />
                <input type="text" value={zipCode} onChange={(e) => setZipcode(e.target.value)} placeholder="Zip Code" className="w-full px-3 py-2 border border-gray-300 rounded" />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-3 py-2 border border-gray-300 rounded" />
                <div className="flex justify-end gap-3">
                  <button className={`${styles.button} text-white text-[16px] !h-[42px]`} onClick={() => setOpenEdit(false)}>Cancel</button>
                  <button className={`${styles.button} text-white text-[16px] !h-[42px]`} onClick={handleUpdate}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSellers;
