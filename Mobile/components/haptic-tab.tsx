import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { StyleSheet } from 'react-native'; // <-- 1. IMPORTAR StyleSheet

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
  	<PlatformPressable
  	  {...props}
      // --- 2. ¡AQUÍ ESTÁ LA MAGIA! ---
      // Combinamos los estilos que Expo le pasa (props.style)
      // con nuestros propios estilos de centrado (styles.button)
      style={[props.style, styles.button]} 
      // --- FIN DEL ARREGLO ---
  	  onPressIn={(ev) => {
  		if (process.env.EXPO_OS === 'ios') {
  		  // Add a soft haptic feedback when pressing down on the tabs.
  		  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  		}
  		props.onPressIn?.(ev);
  	  }}
  	/>
  );
}

// --- 3. AÑADIMOS LOS ESTILOS DE CENTRADO ---
const styles = StyleSheet.create({
  button: {
    flex: 1, // Ocupa el espacio del botón
    // ¡¡ESTAS SON LAS LÍNEAS QUE ARREGLAN TODO!!
    justifyContent: 'center', // Centra verticalmente (ícono y texto)
    alignItems: 'center',     // Centra horizontalmente (ícono y texto)
    paddingVertical: 10,     // (Opcional) Espacio para respirar
  }
});