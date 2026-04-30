const fs = require("node:fs");

async function copyInsteadOfSymlink(target, linkPath) {
  await fs.promises.rm(linkPath, { force: true, recursive: true });
  const stat = await fs.promises.stat(target);

  if (stat.isDirectory()) {
    await fs.promises.cp(target, linkPath, { force: true, recursive: true });
    return;
  }

  await fs.promises.copyFile(target, linkPath);
}

function copyInsteadOfSymlinkSync(target, linkPath) {
  fs.rmSync(linkPath, { force: true, recursive: true });
  const stat = fs.statSync(target);

  if (stat.isDirectory()) {
    fs.cpSync(target, linkPath, { force: true, recursive: true });
    return;
  }

  fs.copyFileSync(target, linkPath);
}

fs.symlink = (target, linkPath, type, callback) => {
  const done = typeof type === "function" ? type : callback;

  copyInsteadOfSymlink(target, linkPath).then(
    () => done?.(null),
    (error) => done?.(error),
  );
};

fs.symlinkSync = (target, linkPath) => {
  copyInsteadOfSymlinkSync(target, linkPath);
};

fs.promises.symlink = async (target, linkPath) => {
  await copyInsteadOfSymlink(target, linkPath);
};
