import styles from "./Loader.module.css"
export default function Loader(){
    console.log(styles);
    return (
      <div className={`${styles.ldr}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
}