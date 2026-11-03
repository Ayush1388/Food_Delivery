import React,{useContext,useState} from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DELIVERY_FEE } from '../../context/StoreContext';
const Cart = () => {

  const {cartItems,food_list,removeFromCart,getTotalCartAmount,url,token,promo,setPromo,getDiscount} = useContext(StoreContext);
  const [promoInput,setPromoInput] = useState(promo.code);
  const [promoMsg,setPromoMsg] = useState('');
  const subtotal = getTotalCartAmount();
  const applyPromo = async () => {
    if (!token) { setPromoMsg('Please sign in to use a promo code'); return; }
    try {
      const r = await axios.post(url+'/api/order/promo',{code:promoInput},{headers:{token}});
      if (r.data.success) setPromo({code:promoInput.trim().toUpperCase(),percent:r.data.percent});
      else setPromo({code:'',percent:0});
      setPromoMsg(r.data.message);
    } catch { setPromoMsg('Could not check the code'); }
  };
  const navigate = useNavigate();
  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item)=>{
          if(cartItems[item._id]>0)
          {
            return (
              <div key={item._id}>
              <div className='cart-items-title cart-items-item'>
               <img src={url+"/images/"+item.image} alt="" />
               <p>{item.name}</p>
               <p>${item.price}</p>
               <p>{cartItems[item._id]}</p>
               <p>${item.price*cartItems[item._id]}</p>
               <p onClick={()=>removeFromCart(item._id) }className="cross">x</p>
              </div>
              <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div><div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          {promo.percent>0 && <><div className="cart-total-details">
            <p>Discount ({promo.code})</p>
            <p>-${getDiscount()}</p>
          </div>
          <hr /></>}
          <div className="cart-total-details">
           <p> Delivery Fee </p>
           <p>${subtotal===0?0:DELIVERY_FEE}</p>
          </div>
          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>${subtotal===0?0:subtotal-getDiscount()+DELIVERY_FEE}</b>
            </div>
            </div>
            <button disabled={getTotalCartAmount()===0} onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>

        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code , Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" value={promoInput} onChange={(e)=>setPromoInput(e.target.value)} placeholder='promo code '/>
              <button type="button" onClick={applyPromo}>Submit</button>
            </div>
            {promoMsg && <p>{promoMsg}</p>}
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Cart
