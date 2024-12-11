import "./Home.css";
import saveEnegry from "../../assets/save energy2.jpg";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className="home">
      <div className="home__welcome">
        <p>{`Welcome, ${user.name}`}</p>
      </div>

      <div className="home__content">
        <div className="news__container">
          <h3>News & Latest Announcement</h3>
          <div className="news">
            <p>
              Six Monthly various Departmental Exam Schedule for Jan -2025 To
              Jun-2025{" "}
            </p>
          </div>
          <div className="news">
            <p>Corrigendum to lottery notice no. 986 dt. 10.10.2024</p>
          </div>
          <div className="news">
            <p>
              Final Roll no of 117th Marathi Language Exam held on 15th Dec-2024
            </p>
          </div>
          <div className="news">
            <p>Corrigendum to lottery notice no. 986 dt. 10.10.2024</p>
          </div>
          <div className="news">
            <p>
              Result of 117th Proficiency Exam for HR Cader held on 14/15
              Sep.2024
            </p>
          </div>
        </div>

        <div className="quickpay">
          <div className="quickpay__billpayment">
            <h3>Quick Bill Payment</h3>
            <div className="billpayment">
              <div className="consumer-no">
                <h4>Consumer Number:</h4>
                <input type="text" placeholder="CXXXXXXXXX"/>
              </div>

              <div className="meter-no">
                <h4>Meter Number:</h4>
                <input type="text" placeholder="MXXXXXXXXXX" />
              </div>

              <button>Pay Now</button>
            </div>
          </div>

          <div className="quickpay__tc">
            <h4>Terms & Conditions</h4>
            <div className="tc">
              &#8226; Please wait for 15 min to reflect payment in your account.
            </div>
            <div className="tc">
              &#8226; Double check the amount before payment.
            </div>
            <div className="tc">
              &#8226; Any discrepancy contact customer care:(91xxxxxxxx).
            </div>
          </div>
        </div>

        <div className="content__img">
          <img src={saveEnegry} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
