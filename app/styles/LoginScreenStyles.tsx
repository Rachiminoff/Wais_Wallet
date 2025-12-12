import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#1a3a3a',
    fontSize: 28,
    fontWeight: '700',
  },
  text: {
    color: '#ffffff',
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 13,
    color: '#1a3a3a',
    paddingHorizontal: 40,
  },
  formTitle: {
    marginTop: 11,
    marginBottom: 26,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  form: {
    width: '95%',
    maxWidth: 380,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(15, 30, 46, 0.7)',
    borderRadius: 20,
    padding: 26,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#528d94',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    alignSelf: 'center',
    textDecorationLine: 'underline',
    color: '#ffffff',
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
