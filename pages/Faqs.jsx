import Collapsible from "react-collapsible";

function Faqs() {
  const faqs = [
    {
      question: "What is MetalCharts? ",
      answer:
        "MetalCharts is an intermediary online stock trading platform that bargains in Gold and Crude oil for an individual to purchase, sell, and store. We go about as a mediator between the traders. For instance, Client A purchases a commodity and after a while if user chooses to sell the commodity we will provide Client B, then the two of them would collaborate on the organization's platform for efficient, secured and effective trade",
    },
    {
      question: "Why are there additional security measures?",
      answer:
        "To ensure the safety of your account, we added additional security measures when signing in to your account from a new device. Because of these changes, you can no longer verify a new trusted device by email alone. Instead, you will need to verify any new trusted devices using the phone number associated with your account",
    },
    {
      question: "How long does an exchange take?",
      answer: `
      Trade duration is determined by method of payment which are faster and instantly. On MetalCharts purchase,withdrawal and Peer-2-Peer transactions need to be confirmed before the buyer sends payment. Commodity transactions take minimum 5minutes to confirm, so with quick traders and quick payment method.MetalCharts trade can be completed in a matter of minutes.
         `,
    },
    {
      question: "Why must I give my personal details? ",
      answer:
        "Before making your first request, we need to know a bit about you. MetalCharts is committed to the highest security and privacy standards. This also helps us keep your account safe and fight fraud This process is called VERIFICATION and is mandatory on our platform. After submitting your details for verification, we will go through them and make ensure it’s authentic. This usually happens within the hour.",
    },
    {
      question: "What methods of payment does MetalCharts offer?",
      answer: "You can currently buy Gold and Brent crude oil by the method of payment the Seller provide and the one suitable for the Buyer.",
    },
    {
      question:
        "Does MetalCharts facilitates trading between buyers and sellers?",
      answer:
        "Yes. MetalCharts facilitates trading between buyers and sellers.",
    },
    {
      question: "Is there any charges on Metalcharts?",
      answer: "No Peer-2-Peer service charge is 0%.",
    },
    {
      question: "Can I fix my own price on commodity",
      answer:
        "Yes, you can fix your own market price to your own suitable amount",
    },
    {
      question: "How long will withdrawal takes?",
      answer: "Withdrawal takes minimum of 5 minutes to maximum of 24 hours",
    },
    {
      question: "Hope Metalcharts is not a ponzi scheme?",
      answer:
        "No this is not a double money platform,this is a world market trade",
    },
    {
      question: "Is there a duration or percentage on metalcharts?",
      answer: `No percentage return.No duration.No monthly payment.
         
         `,
    },
    {
      question: "How do I win the Bonus Trade items?",
      answer:
        "This is another opportunity, you click on the item you want to win, the more people you bring, more your chances. Note this wont stop you referral bonus.",
    },
    {
      question: "How can i purchase commodities on MetalCharts?",
      answer: `You can purchase commodity via Peer-2-Peer.
      `,
    },
    {
      question: "How can i Sell my commodities",
      answer: `
      On Metalcharts you can Sell commodities via Peer-2-Peer.
      `,
    },
    {
      question: "How do I protect myself against fraud? ",
      answer: `
      Metalcharts Peer-2-Peer Escrow FTW! As one of the several safeguards on the platform, Metalcharts Peer-2-Peer has a holding mechanism for commodity funds that are involved in any pending transaction. This mechanism prevents incidents of theft or scam by adding another layer of trust, thus preventing malicious actors from stealing your money or commodity without completing their part of the trade.`,
    },
    {
      question: "Can i trade on Metalcharts any in the world?",
      answer: `Yes with Metalcharts you can trade any where you are.`,
    },
    {
      question: "What percentage is the referral bonus?",
      answer: `Referral bonus is 5%.`,
    },
    {
      question: "When can i sell my commodity for payout?",
      answer: `With Metalcharts you decide when to sell your commodity at your own time.`,
    }
  ];

  return (
    <section className="min-h-screen">
      <div className="mycontainer flex flex-col">
         <h2 className="mx-2 mt-20 mb-4 text-2xl lg:text-4xl font-bold text-blue-900">Most Frequantly Asked Questions:</h2>
         {
            faqs.map((item,id)=>{
               return <MyCollapsible key={id} question={item.question} answer={item.answer} />
            })
         }
         <div className="mx-2 my-8 text-center">
            <h3 className="text-xl lg:text-2xl font-bold text-blue-900">Still Have Questions?</h3>
            <p className="font-light">Contact us via Support@metalcharts.net</p>
         </div>
      </div>
    </section>
  );
}

function MyCollapsible({ question, answer }) {
  return (
    <Collapsible trigger={question} classParentString="collapsible" className="border-blue-300 shadow-lg" openedClassName="border-green-500 shadow-xl">
      <p>{answer}</p>
    </Collapsible>
  );
}

export default Faqs;
