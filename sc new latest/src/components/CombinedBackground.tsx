import ParticleBackground from './ParticleBackground';

const CombinedBackground = () => {
    return (
        <div className="fixed inset-0 z-0">
            <ParticleBackground />
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px]" />
        </div>
    );
};

export default CombinedBackground;
