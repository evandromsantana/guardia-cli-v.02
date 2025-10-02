// src/components/shared/LogoGuardia.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

export default function LogoGuardia() {
  const wingFlap = useSharedValue(0);
  const haloPulse = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const particleFloat = useSharedValue(0);
  const textGlow = useSharedValue(0);

  React.useEffect(() => {
    // Asas - movimento mais orgânico
    wingFlap.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Halo - pulsação suave
    haloPulse.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Glow - pulsação lenta
    glowPulse.value = withRepeat(
      withTiming(1, { duration: 3500, easing: Easing.sin }),
      -1,
      true
    );

    // Partículas flutuantes
    particleFloat.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Texto com glow sutil
    textGlow.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  // Animação das asas mais orgânica
  const leftWingProps = useAnimatedProps(() => {
    const rotation = interpolate(wingFlap.value, [0, 1], [-12, 8]);
    const scaleY = interpolate(wingFlap.value, [0, 1], [0.85, 1.05]);
    const scaleX = interpolate(wingFlap.value, [0, 1], [0.95, 1.02]);

    return {
      transform: [
        { translateX: 50 },
        { translateY: 45 },
        { rotate: `${rotation}deg` },
        { scaleY },
        { scaleX },
        { translateX: -50 },
        { translateY: -45 },
      ],
    };
  });

  const rightWingProps = useAnimatedProps(() => {
    const rotation = interpolate(wingFlap.value, [0, 1], [12, -8]);
    const scaleY = interpolate(wingFlap.value, [0, 1], [0.85, 1.05]);
    const scaleX = interpolate(wingFlap.value, [0, 1], [0.95, 1.02]);

    return {
      transform: [
        { translateX: 50 },
        { translateY: 45 },
        { rotate: `${rotation}deg` },
        { scaleY },
        { scaleX },
        { translateX: -50 },
        { translateY: -45 },
      ],
    };
  });

  // Halo com múltiplos efeitos
  const haloProps = useAnimatedProps(() => {
    const scale = interpolate(haloPulse.value, [0, 1], [0.95, 1.08]);
    const opacity = interpolate(haloPulse.value, [0, 1], [0.6, 0.9]);

    return {
      transform: [
        { translateX: 50 },
        { translateY: 25 },
        { scale },
        { translateX: -50 },
        { translateY: -25 },
      ],
      opacity,
    };
  });

  // Glow de fundo complexo
  const glowProps = useAnimatedProps(() => {
    const opacity = interpolate(glowPulse.value, [0, 1], [0.2, 0.5]);
    const scale = interpolate(glowPulse.value, [0, 1], [0.98, 1.02]);

    return {
      opacity,
      transform: [
        { translateX: 50 },
        { translateY: 50 },
        { scale },
        { translateX: -50 },
        { translateY: -50 },
      ],
    };
  });

  // Partículas flutuantes
  const particle1Props = useAnimatedProps(() => {
    const translateY = interpolate(particleFloat.value, [0, 1], [0, -3]);
    const opacity = interpolate(particleFloat.value, [0, 1], [0.4, 0.8]);

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const particle2Props = useAnimatedProps(() => {
    const translateY = interpolate(particleFloat.value, [0, 1], [-2, 2]);
    const opacity = interpolate(particleFloat.value, [0, 1], [0.6, 0.3]);

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  // Efeito de glow no texto
  const textProps = useAnimatedProps(() => {
    const shadowOpacity = interpolate(textGlow.value, [0, 1], [0.2, 0.5]);

    return {
      style: {
        textShadowColor: `rgba(211, 84, 0, ${shadowOpacity})`,
      },
    } as any;
  });

  return (
    <View style={styles.container}>
      <Svg width={220} height={220} viewBox="0 0 100 100">
        <Defs>
          {/* Gradiente principal refinado */}
          <LinearGradient id="mainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#D35400" stopOpacity={1} />
            <Stop offset="50%" stopColor="#C44E00" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#B33951" stopOpacity={0.8} />
          </LinearGradient>

          {/* Gradiente das asas */}
          <LinearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#D35400" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#E67E22" stopOpacity={0.7} />
          </LinearGradient>

          {/* Gradiente do halo refinado */}
          <RadialGradient id="haloGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#F4D35E" stopOpacity={1} />
            <Stop offset="70%" stopColor="#F4D35E" stopOpacity={0.4} />
            <Stop offset="100%" stopColor="#F4D35E" stopOpacity={0} />
          </RadialGradient>

          {/* Gradiente de glow sofisticado */}
          <RadialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FAEBD7" stopOpacity={0.3} />
            <Stop offset="50%" stopColor="#FAEBD7" stopOpacity={0.15} />
            <Stop offset="100%" stopColor="#FAEBD7" stopOpacity={0} />
          </RadialGradient>

          {/* Sombras suaves */}
          <RadialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#2C2C2C" stopOpacity={0.1} />
            <Stop offset="100%" stopColor="#2C2C2C" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Sombra suave atrás */}
        <Circle cx="52" cy="52" r="46" fill="url(#shadowGradient)" />

        {/* Glow de fundo pulsante refinado */}
        <AnimatedCircle
          animatedProps={glowProps}
          cx="50"
          cy="50"
          r="44"
          fill="url(#glowGradient)"
        />

        {/* Halo angelical refinado */}
        <AnimatedG animatedProps={haloProps}>
          <Circle cx="50" cy="25" r="14" fill="url(#haloGradient)" />
          <Circle
            cx="50"
            cy="25"
            r="12"
            fill="none"
            stroke="#F4D35E"
            strokeWidth={1.2}
            opacity={0.8}
          />
          <Circle
            cx="50"
            cy="25"
            r="9"
            fill="none"
            stroke="#FAEBD7"
            strokeWidth={0.8}
            opacity={0.6}
          />
        </AnimatedG>

        {/* Asas do anjo com mais detalhes */}
        <G>
          <AnimatedPath
            animatedProps={leftWingProps}
            d="M30 40 C15 32, 12 38, 8 50 C18 44, 28 48, 38 52 C33 47, 28 43, 30 40"
            fill="url(#wingGradient)"
            stroke="#2C2C2C"
            strokeWidth={0.3}
            opacity={0.98}
          />
          <AnimatedPath
            animatedProps={rightWingProps}
            d="M70 40 C85 32, 88 38, 92 50 C82 44, 72 48, 62 52 C67 47, 72 43, 70 40"
            fill="url(#wingGradient)"
            stroke="#2C2C2C"
            strokeWidth={0.3}
            opacity={0.98}
          />
        </G>

        {/* Corpo central - Pino de GPS mais detalhado */}
        <G>
          {/* Base do pino com profundidade */}
          <Path
            d="M50 28 L58 40 L50 68 L42 40 Z"
            fill="url(#mainGradient)"
            stroke="#2C2C2C"
            strokeWidth={0.8}
          />

          {/* Destaque interno */}
          <Path
            d="M50 32 L55 40 L50 60 L45 40 Z"
            fill="#FAEBD7"
            opacity={0.3}
          />

          {/* Círculo central com gradiente */}
          <Circle cx="50" cy="42" r="10" fill="#FAEBD7" opacity={0.95} />
          <Circle
            cx="50"
            cy="42"
            r="8"
            fill="url(#mainGradient)"
            opacity={0.8}
          />

          {/* Ponto central do GPS */}
          <Circle cx="50" cy="42" r="3" fill="#FAEBD7" opacity={0.95} />
          <Circle cx="50" cy="42" r="1.5" fill="#B33951" />
        </G>

        {/* Partículas de proteção flutuantes */}
        <AnimatedCircle
          animatedProps={particle1Props}
          cx="35"
          cy="35"
          r="1.2"
          fill="#F4D35E"
        />
        <AnimatedCircle
          animatedProps={particle2Props}
          cx="65"
          cy="38"
          r="1"
          fill="#F4D35E"
        />
        <AnimatedCircle
          animatedProps={particle1Props}
          cx="40"
          cy="60"
          r="0.8"
          fill="#F4D35E"
        />
        <AnimatedCircle
          animatedProps={particle2Props}
          cx="60"
          cy="58"
          r="1.1"
          fill="#F4D35E"
        />

        {/* Anel decorativo externo */}
        <Circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#F4D35E"
          strokeWidth={0.5}
          strokeDasharray="2,2"
          opacity={0.4}
        />
      </Svg>

      <Animated.Text style={[styles.text, textProps]}>Guardiã</Animated.Text>
      <Text style={styles.subtitle}>Caminhe com confiança</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: 10,
  },
  text: {
    position: "absolute",
    top: 150,
    fontSize: 28,
    fontFamily: "System",
    fontWeight: "900",
    color: "#D35400",
    letterSpacing: 3,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    position: "absolute",
    top: 185,
    fontSize: 11,
    fontFamily: "System",
    fontWeight: "600",
    color: "#D35400",
    letterSpacing: 2,
    opacity: 0.9,
    textTransform: "uppercase",
  },
});
