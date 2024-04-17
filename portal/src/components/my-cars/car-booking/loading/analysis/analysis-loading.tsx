import AnalysisCardLoading from './analysis-card-loading';

export default function AnalysisLoading() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnalysisCardLoading />
            <AnalysisCardLoading />
            <AnalysisCardLoading />
            <AnalysisCardLoading />
        </div>
    );
}
