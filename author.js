
// ------------------ Export ------------------
exportBtn.addEventListener("click", ()=>{
  const dataStr = JSON.stringify({capsules}, null, 2);
  const dataStr = JSON.stringify(capsules, null, 2); // فقط آرایه
  const blob = new Blob([dataStr], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
importBtn.addEventListener("click", ()=>{
    reader.onload = ev=>{
      try {
        const imported = JSON.parse(ev.target.result);
        if(imported.capsules && Array.isArray(imported.capsules)){
          imported.capsules.forEach(c=>{
            if(!c.id) c.id = Date.now().toString() + Math.random();
            capsules.push(c);
          });
          saveCapsules();
          alert("Capsules imported successfully!");
        }
      } catch(err){ alert("Invalid JSON file."); }
        let importedCapsules = [];
        if(Array.isArray(imported)) importedCapsules = imported; // آرایه ساده
        else if(imported.capsules && Array.isArray(imported.capsules)) importedCapsules = imported.capsules; // آرایه داخل آبجکت
        importedCapsules.forEach(c=>{
          if(!c.id) c.id = Date.now().toString() + Math.random();
          capsules.push(c);
        });
        saveCapsules(); // ذخیره و بروزرسانی Learn Mode
        currentCapsule = capsules[capsules.length-1]; // آخرین کپسول را انتخاب کن
        loadAuthorForm();
        alert("Capsules imported successfully!");
      } catch(err){
        alert("Invalid JSON file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  });
