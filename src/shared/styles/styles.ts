import { Colors } from "./Colors";

export const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.cinzaescuro,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: Colors.cinza,
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: Colors.roxoescuro,
      padding: '12px 20px',
      borderRadius: '10px',
      color: Colors.branco,
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    input: {
      border: `1px solid ${Colors.cinzaclaro2}`,
      borderRadius: 8,
      padding: '12px 16px',
      fontSize: 16,
      backgroundColor: Colors.branco,
      color: Colors.cinzaescuro,
      height: 50,
      width: '100%',
      marginBottom: 10,
    }
  };