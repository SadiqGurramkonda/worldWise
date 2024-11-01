import styles from "./ErrorComponent.module.css"

export default function ErrorComponent({children}){
    console.log(styles);

    return(
        <div className={`${styles.error}`}>
            {children}
        </div>
    )
}