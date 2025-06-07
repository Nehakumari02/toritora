import React, { useState, useEffect } from "react";

interface DropdownTimePickerProps {
    setDate: (date: Date) => void;
    isEndTime?: boolean;
    time?: Date;
}

const CustomDropdown = ({
    value,
    onChange,
    options,
}: {
    value: number;
    onChange: (val: number) => void;
    options: number[];
}) => {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: "relative", width: "60px", fontFamily: "Arial, sans-serif" }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    padding: "4px 6px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "center",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                }}
            >
                <span>{value.toString().padStart(2, "0")}</span>
                <span style={{ fontSize: "10px", marginLeft: "4px" }}>▼</span>
            </div>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        maxHeight: "120px", // compact height
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        background: "#fff",
                        zIndex: 1000,
                        marginTop: "4px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setOpen(false);
                            }}
                            style={{
                                padding: "4px 6px",
                                textAlign: "center",
                                background: opt === value ? "#e6f7ff" : "#fff",
                                fontWeight: opt === value ? "bold" : "normal",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = opt === value ? "#e6f7ff" : "#fff")
                            }
                        >
                            {opt.toString().padStart(2, "0")}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const DropdownTimePicker: React.FC<DropdownTimePickerProps> = ({
    setDate,
    isEndTime = false,
    time,
}) => {
    const getInitialDate = () => {
        if (time) return new Date(time);
        const now = new Date();
        if (isEndTime) {
            now.setHours(now.getHours() + 1);
        }
        return now;
    };

    const [selectedHour, setSelectedHour] = useState(getInitialDate().getHours());
    const [selectedMinute, setSelectedMinute] = useState(getInitialDate().getMinutes());

    useEffect(() => {
        if (time) {
            setSelectedHour(time.getHours());
            setSelectedMinute(time.getMinutes());
        } else if (isEndTime) {
            const newTime = new Date();
            newTime.setHours(newTime.getHours() + 1);
            setSelectedHour(newTime.getHours());
            setSelectedMinute(newTime.getMinutes());
        }
    }, [time, isEndTime]);

    useEffect(() => {
        const updatedTime = new Date();
        updatedTime.setHours(selectedHour, selectedMinute, 0, 0);
        setDate(updatedTime);
    }, [selectedHour, selectedMinute, setDate]);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <CustomDropdown value={selectedHour} onChange={setSelectedHour} options={hours} />
            <span style={{ fontWeight: "bold", fontSize: "18px", alignSelf: "center" }}>:</span>
            <CustomDropdown value={selectedMinute} onChange={setSelectedMinute} options={minutes} />
        </div>
    );
};

export default DropdownTimePicker;
