# This checks if the number of arguments is correct
# If the number of arguments is incorrect ( $# != 2) print error message and exit
if [[ $# != 2 ]]
then
  echo "backup.sh target_directory_name destination_directory_name"
  exit
fi

# This checks if argument 1 and argument 2 are valid directory paths
if [[ ! -d $1 ]] || [[ ! -d $2 ]]
then
  echo "Invalid directory path provided"
  exit
fi

# [TASK 1]
targetDirectory="$1"
destinationDirectory="$2"

# [TASK 2]
echo "Target directory: $targetDirectory"
echo "Backup destination: $destinationDirectory"

# [TASK 3]
currentTS=$(date +%s)

# [TASK 4]
backupFileName="backup-[$currentTS].tar.gz"

# We're going to:
  # 1: Go into the target directory
  # 2: Create the backup file
  # 3: Move the backup file to the destination directory

# To make things easier, we will define some useful variables...

# [TASK 5]
origAbsPath=`pwd`

# [TASK 6]
cd $destinationDirectory
destDirAbsPath=`pwd`

# [TASK 7]
cd "$origAbsPath"
cd "$targetDirectory"

# [TASK 8]
yesterdayTS=$(($currentTS - 24 * 60 * 60))

declare -a toBackup

for file in $(ls) # [TASK 9]
do
  # [TASK 10]
  if (($(date -r $file +%s) > $yesterdayTS))
  then
  echo "[+] Creating Destination Directory"
	mkdir $destinationDirectory
    # [TASK 11]
  fi
cd $destinationDirectory
destDirAbsPath=$(pwd)
cd $origAbsPath
cd $targetDirectory
yesterdayTS=$(date -d yesterday +%s)
# make a list of all files
declare -a toBackup
for file in $(ls); do
	if (($(date -r $file +%s) > $yesterdayTS)); then
    toBackup+=($file)
done

# [TASK 12]
tar -zcvf $backupFileName ${toBackup[@]}
# [TASK 13]
echo "[+] Moving $backupFileName to $destDirAbsPath"
mv $backupFileName $destDirAbsPath
echo "[+] Backup Complete!
# Congratulations! You completed the final project for this course!
