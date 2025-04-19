const TimelineStep = ({ step, order, isCompleted, isCurrent, isLastStep, icon, description }) => {
    // Get the timestamp for the current step's status
    const statusTimestamp = order.statusTimestamps[step.status];

    // Consistent styling for all timeline steps
    const iconBgColor = step?.status === 'completed' ? 'bg-green-900' : 
                        step?.status === 'pending' ? 'bg-red-700' : 
                        step?.status === 'processing' ? 'bg-blue-600' : 'bg-indigo-900';
    const iconTextColor = 'text-white';
    const connectorColor = isCompleted ? 'bg-blue-500' : 'bg-gray-200';
    const labelTextColor = isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500';
    const descriptionTextColor = isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500';

    return (
        <li className="flex-1">
            {/* Force consistent height with a wrapper */}
            <div className="flex flex-col">
                {/* Icon and connector line with fixed positioning */}
                <div className="flex items-center h-6">
                    <div className={`z-10 flex items-center justify-center w-6 h-6 ${iconBgColor} ${iconTextColor} rounded-full shrink-0`}>
                        <i className={`ri-${icon.iconName} text-sm`}></i>
                    </div>
                    {/* Horizontal line between steps */}
                    {!isLastStep && (
                        <div className={`flex-1 h-0.5 ${connectorColor}`} />
                    )}
                </div>
                
                {/* Text content with fixed top margin */}
                <div className="mt-2">
                    <h3 className={`text-sm font-medium ${labelTextColor}`}>{step.label}</h3>

                    {(isCompleted || isCurrent) && statusTimestamp && (
                        <time className="block text-xs font-normal text-gray-500">
                            {new Date(statusTimestamp).toLocaleString()}
                        </time>
                    )}

                    {(isCompleted || isCurrent) && description && (
                        <p className={`text-sm font-normal mt-1 ${descriptionTextColor}`}>
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </li>
    );
};

export default TimelineStep;
