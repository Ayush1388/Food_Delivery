import React, { useEffect,useState } from 'react'
import './List.css'
import {url} from '../../assets/assets'
import axios from "axios"
import {toast} from "react-toastify"
const List = () => {

  const [list,setList] = useState([]);
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);
    if(response.data.success) {
      setList(response.data.data);

    } 
    else{
      toast.error("error")
    }
  }
  const removeFood = async (foodId) => {
    if (!window.confirm("Remove this item?")) return;
    const response = await axios.post(`${url}/api/food/remove`, {id: foodId});
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchList();
    } else {
      toast.error(response.data.message);
    }
  }
  useEffect(()=>{
    fetchList();
  },[])
  return (
    <div className='list add flex-col'>
      <p>All foods list</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item)=>{
          return (
            <div key ={item._id} className='list-table-format'>
              <img src = {`${url}/images/${item.image}`} alt="" />
             
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p >  ${item.price}</p>
              <p onClick={()=>removeFood(item._id)} className="cursor">X</p>
              
              </div>
              
          )
          

        })}

      </div>
      
    </div>
  )
}

export default List
