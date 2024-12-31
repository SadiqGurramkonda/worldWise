import styles from "./Loader.module.css"
export default function Loader(){

    return (
      <div className={`${styles.ldr}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
}