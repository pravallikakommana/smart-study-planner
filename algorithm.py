def generate_plan(data):

    subjects = data.get("subjects", [])
    difficulty = data.get("difficulty", [])
    slots = data.get("slots", [])
    hours = float(data.get("hours", 1))

    if not subjects or not slots:
        return []

    weights = {"easy":1, "medium":2, "hard":3}

    total_minutes = int(hours * 60)
    total_weight = sum(weights.get(d,1) for d in difficulty)

    subject_minutes = []

    for i in range(len(subjects)):
        mins = int((weights.get(difficulty[i],1)/total_weight)*total_minutes)
        subject_minutes.append({
            "subject":subjects[i],
            "minutes":mins
        })

    used = sum(s["minutes"] for s in subject_minutes)
    if subject_minutes:
        subject_minutes[0]["minutes"] += (total_minutes - used)

    # 🔥 SLOT TIME FIX
    slot_minutes = []

    for slot in slots:
        try:
            s = slot.upper().replace("AM","").replace("PM","")
            start, end = s.split("-")

            start = int(start)
            end = int(end)

            duration = end - start

            if duration <= 0:
                duration += 12

            slot_minutes.append(duration * 60)

        except:
            slot_minutes.append(60)

    plan = []

    for i, slot in enumerate(slots):

        remain = slot_minutes[i]
        tasks = []

        for sub in subject_minutes:

            if sub["minutes"] > 0 and remain > 0:

                assign = min(sub["minutes"], remain, slot_minutes[i])

                tasks.append({
                    "subject": sub["subject"],
                    "minutes": assign,
                    "done": False
                })

                sub["minutes"] -= assign
                remain -= assign

        plan.append({
            "slot": slot,
            "tasks": tasks
        })

    return plan