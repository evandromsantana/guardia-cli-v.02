// src/components/common/Logo.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Definição das cores (caso não tenha o arquivo de constantes)
const COLORS = {
  primary: '#D35400', // Laranja
  warning: '#F39C12', // Amarelo alaranjado
  accent: '#E74C3C', // Vermelho
};

export default function Logo() {
  const angle = useSharedValue(0);

  React.useEffect(() => {
    angle.value = withRepeat(
      withTiming(360, { duration: 12000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [angle]);

  const useParticle = (offset: number, radius: number) => {
    return useAnimatedProps(() => {
      const rad = ((angle.value + offset) * Math.PI) / 180;
      return {
        cx: 50 + radius * Math.cos(rad),
        cy: 50 + radius * Math.sin(rad),
      };
    });
  };

  const particles = [
    useParticle(0, 28),
    useParticle(120, 35),
    useParticle(240, 40),
    useParticle(60, 22),
  ];

  return (
    <View style={styles.container}>
      <Svg width={160} height={160} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={COLORS.primary} stopOpacity="1" />
            <Stop offset="60%" stopColor={COLORS.warning} stopOpacity="0.7" />
            <Stop offset="100%" stopColor={COLORS.accent} stopOpacity="0.3" />
          </RadialGradient>
        </Defs>

        <Circle
          cx="50"
          cy="50"
          r="44"
          stroke="url(#grad)"
          strokeWidth="3"
          fill="none"
          opacity={0.7}
        />

        <Circle
          cx="50"
          cy="50"
          r="34"
          stroke={COLORS.primary}
          strokeWidth="2.5"
          strokeOpacity={0.9}
          fill="none"
        />

        <Circle
          cx="50"
          cy="50"
          r="22"
          stroke={COLORS.accent}
          strokeWidth="1.6"
          strokeOpacity={0.8}
          fill="none"
        />

        {particles.map((props, i) => (
          <AnimatedCircle
            key={`p-${i}`}
            r={i % 2 === 0 ? 3.8 : 2.8}
            fill={i % 2 === 0 ? COLORS.primary : COLORS.accent}
            animatedProps={props}
          />
        ))}
      </Svg>

      <Text style={styles.text}>Guardiã</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: COLORS.primary,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(211, 84, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});
