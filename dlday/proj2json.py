import json
import os
import os.path
import pandas as pd

filedir = os.path.dirname(os.path.realpath(__file__))

def process_project(titles_so_far, row):
    # Filter out duplicates
    if row["Project Name"] in titles_so_far:
        return False

    # Construct the JSON object
    projobj = {
        "title": row['Project Name'],
        "members": row['Group Member Names'],
        "mentor": row["Your Mentor TA's name"],
        "area": row['Area'],
        "is_oral": row['2470/capstone?'] == 'Yes',
        "devpost": row['Devpost submission link']
    }
    for key in projobj:
        if isinstance(projobj[key], str):
            projobj[key] = projobj[key].strip()

    return projobj

def process_all_projects(df):
    projs = []
    titles = {}
    for _,row in df.iterrows():
        proj = process_project(titles, row)
        if proj:
            projs.append(proj)
            titles[proj['title']] = True
    return projs

if __name__ == "__main__":
    df = pd.read_csv(f"{filedir}/projects.csv")
    pubs = process_all_projects(df)
    with open(f"{filedir}/../_data/projects.json", "w") as f:
        f.write(json.dumps(pubs, indent="   "))