import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  data: {
    title: string;
    value: string;
    description: string;
    additionalInfo?: Array<{ label: string; value: string }>;
  };
}

const Card: React.FC<CardProps> = ({ data }) => {
  return (
    <div className={styles.card}>
      <h4>{data.title}</h4>
      <p className={styles.time}><strong>{data.value}</strong></p>  
      {data.additionalInfo && (
        <div className={styles.additionalInfo}>
          {data.additionalInfo.map((info, index) => (
            <p key={index}>
              <strong>{info.label}:</strong> {info.value}
            </p>
          ))}
        </div>
      )}
      <p>{data.description}</p>
    </div>
  );
};

export default Card;