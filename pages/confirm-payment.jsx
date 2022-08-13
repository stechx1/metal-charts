import { useRouter } from 'next/router'
import React from 'react'

const ConfirmPayment = () => {
  const router = useRouter();
  return (
    <div className='flex my-[100px]'>
      <div className='max-w-[990px] justify-center content-center mx-auto bg-slate-200'>
        <div className='p-4'>
        <p className='text-xl'>Buyer Name sent you money in<span className='font-bold'>Bank account name</span></p>
        <p className="text-xl">exactly with the amount <span className='font-bold'>4179 </span></p>
        <p className="text-xl">exactly with the content <span className='font-bold'></span></p>

        <p className='mt-2'>Please confirm this transaction</p>
        <br/>
        <br/>
        <div className='flex'>
        <button onClick={() => router.push('/chat')}
              className={`bg-white text-blue-900 py-2 px-4 border-8`}
            >
              Chat with buyer
            </button>
        <button onClick={() => alert("Seller has been informed about your payment. Once seller approve your payment you will be redirected")}
              className={`text-white bg-blue-900 py-2 px-4 border-8`}
            >
              Confirm Payment
            </button>

        </div>
        </div>
        
      </div>
    </div>
  )
}

export default ConfirmPayment