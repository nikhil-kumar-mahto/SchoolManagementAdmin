import styles from "./FullPageLoader.module.css";

type Props = {
  visible: boolean;
  message?: string;
};

const FullPageLoader: React.FC<Props> = ({
  visible,
  message = "Loading...",
}) => {
  if (!visible) return null;

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
