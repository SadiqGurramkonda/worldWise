
import styles from "./Button.module.css";
import Loader from "./Loader";

function Button({ children, onClick, type, isLoading }) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`} disabled={isLoading} type={type}>
      {children}
      { isLoading && <Loader />}
    </button>
  );
}

// export function ButtonLoading({children,onClick,isLoading}){
//   return (
//     <button type="button" id="button" onclick="handleClick()">
//       <span id="spinner" class="spinner hidden"></span>
//       <span id="button-text">Load</span>
//     </button>
//   );

// } 

export default Button;
