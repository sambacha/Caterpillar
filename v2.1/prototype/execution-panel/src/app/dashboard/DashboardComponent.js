var DashboardComponent = React.createClass({
  render: function() {
    return (

      <div className="container-fluid">
        <div className="navbar-header">
        </div>
        <div className="panel-group">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title">
                <a data-toggle="collapse" href="#collapse1"> <strong> Configuration: Process Runtime Registry Operations </strong> </a>
              </h4>
            </div>
            <div id="collapse1" className="panel-collapse collapse">
              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-2">
                    <button className="btn btn-success" (click)="createProcessRegistry()"> Create Registry </button>
                  </div>
                  <div className="col-lg-5">
                    <div className="input-group">
                      <span className="input-group-btn">
                        <button className="btn btn-primary" (click)="loadProcessRegistry()">Load Registry From </button>
                      </span>
                      <input type="text" className="form-control" [(ngmodel)]="registryAddress" placeholder="Registry address or ID in Repository" />
                    </div>{/* /input-group */}
                  </div>{/* /.col-lg-6 */}
                </div>
              </div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title">
                <a data-toggle="collapse" href="#collapse2"> <strong> Binding Policy: Static Configuration </strong> </a>
              </h4>
            </div>
            <div id="collapse2" className="panel-collapse collapse">
              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="input-group">
                      <span className="input-group-btn">
                        <button className="btn btn-success" (click)="sendResourceModel()"> Deploy Binding Policy </button>
                      </span>
                      <input type="file" className="btn btn-info" single (change)="openFile($event)" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8">
                    <label htmlFor="comment">Binding Policy to Deploy:</label>
                    <textarea className="form-control" rows={6} [(ngmodel)]="bindingPolicy" defaultValue={""} />
                  </div>
                </div>
                <div className="row">
                  <hr />
                  <div className="col-lg-5">
                    <div className="input-group">
                      <span className="input-group-btn">
                        <button type="submit" className="btn btn-success" (click)="createTaskRole()"> Deploy TaskRoleMap From </button>
                      </span>
                      <input type="text" className="form-control" [(ngmodel)]="rootProcess" placeholder="Process ID in Repository" />
                      <input type="text" className="form-control" [(ngmodel)]="policyId" placeholder="Policy ID in Repository" />
                    </div>{/* /input-group */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title">
                <a data-toggle="collapse" href="#collapse3"><strong>Binding Policy: Runtime Operations</strong></a>
              </h4>
            </div>
            <div id="collapse3" className="panel-collapse collapse">
              <div className="panel-body">
                <div className="row">
                  <hr />
                  <div className="col-lg-2">
                    <input type="text" className="form-control" [(ngmodel)]="roleToQuery" placeholder="Role Name" />
                  </div>
                  <div className="col-lg-3">
                    <input type="text" className="form-control" [(ngmodel)]="pCaseQuery" placeholder="Process Case To Query" />
                  </div>
                  <div className="col-lg-2">
                    <button type="submit" className="btn btn-info" (click)="findRoleState()"> Find Role Binding State </button>
                  </div>
                </div>
                <div className="row">
                  <hr />
                  <div className="col-lg-3">
                    <input type="text" className="form-control" [(ngmodel)]="nominatorRole" placeholder="Nominator Role" />
                  </div>
                  <div className="col-lg-3">
                    <input type="text" className="form-control" [(ngmodel)]="nomineeRole" placeholder="Nominee Role" />
                  </div>
                  <div className="col-lg-3">
                    <input type="text" className="form-control" [(ngmodel)]="procesCase" placeholder="Process Case" />
                  </div>
                </div>
                <div className="row">
                  <hr />
                </div>
                <div className="row">
                  <div className="container-fluid">
                    <div className="panel panel-success">
                      <div className="panel-heading"> Nomination </div>
                      <div className="panel-body">
                        <div className="col-lg-3">
                          <input type="text" className="form-control" [(ngmodel)]="nominatorNAddress" placeholder="Nominator Address" />
                        </div>
                        <div className="col-lg-3">
                          <input type="text" className="form-control" [(ngmodel)]="nomineeNAddress" placeholder="Nominee Address" />
                        </div>
                        <div className="col-lg-3">
                          <button type="submit" className="btn btn-success" (click)="nominate()"> Nominate </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="container-fluid">
                    <div className="panel panel-danger">
                      <div className="panel-heading"> Release </div>
                      <div className="panel-body">
                        <div className="col-lg-3">
                          <input type="text" className="form-control" [(ngmodel)]="nominatorRAddress" placeholder="Releaser Address" />
                        </div>
                        <div className="col-lg-3">
                          <button type="submit" className="btn btn-danger" (click)="release()"> Release </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="container-fluid">
                    <div className="panel panel-warning">
                      <div className="panel-heading"> Vote </div>
                      <div className="panel-body">
                        <div className="col-lg-3">
                          <input type="text" className="form-control" [(ngmodel)]="endorserRole" placeholder="Endorser Role" />
                        </div>
                        <div className="col-lg-3">
                          <input type="text" className="form-control" [(ngmodel)]="endorserAddress" placeholder="Endorser Address" />
                        </div>
                        <div className="col-lg-3">
                          <span className="border">
                            <label className="radio-inline">
                              <input type="radio" name="R1" [(ngmodel)]="onNomination" defaultValue="true" />
                              On-nomination
                            </label>
                            <label className="radio-inline">
                              <input type="radio" name="R1" [(ngmodel)]="onNomination" defaultValue="false" />
                              On-release
                            </label>
                          </span>
                        </div>
                        <div className="col-lg-2">
                          <span className="border">
                            <label className="radio-inline">
                              <input type="radio" name="R2" [(ngmodel)]="isAccepted" defaultValue="true" />
                              Accept
                            </label>
                            <label className="radio-inline">
                              <input type="radio" name="R2" [(ngmodel)]="isAccepted" defaultValue="false" />
                              Reject
                            </label>
                          </span>
                        </div>
                        <div className="col-lg-1">
                          <button type="submit" className="btn btn-warning" (click)="vote()"> Vote </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="panel panel-default">
            <div className="panel-heading">
              <h4 className="panel-title">
                <a data-toggle="collapse" href="#collapse4"> <strong> Business Process Operations </strong> </a>
              </h4>
            </div>
            <div id="collapse4" className="panel-collapse collapse">
              <div className="panel-body">
                <div className="row">
                  <div className="col-lg-2">
                    <button className="btn btn-success" (click)="openModeler()"> Add Process Model </button>
                  </div>
                  <div className="col-lg-4">
                    <div className="input-group">
                      <span className="input-group-btn">
                        <button type="submit" className="btn btn-info" (click)="searchElement()"> Search Models </button>
                      </span>
                      <input type="text" className="form-control" [(ngmodel)]="toSearch" placeholder="Search" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <hr />
                </div>
                <div className="row">
                  <div className="col-lg-1">
                    <span className="label label-info"> Process Models List =&gt; </span>
                  </div>
                  <div className="col-lg-2">
                    <input type="text" className="form-control" [(ngmodel)]="caseCreatorRole" placeholder="Case Creator Role" />
                  </div>
                  <div className="col-lg-3">
                    <input type="text" className="form-control" [(ngmodel)]="caseCreator" placeholder="Case Creator Address" />
                  </div>
                </div>
                <div className="row">
                  <hr />
                </div>
                <div className="row">
                  <div id="canvas" />
                  <div>
                    <div className="panel-group" id="accordion1">
                      <div className="panel panel-default" *ngfor="let proc of processStorage.processes">
                        <div className="panel-heading">
                          <h4 className="panel-title">
                            <a data-toggle="collapse" data-parent="#accordion1" [attr.href]="'#'+proc.id">{'{'}{'{'}proc.name{'}'}{'}'}
                            </a>
                            <div className="pull-right">
                              <button className="btn btn-success btn-xs" (click)="createInstance(proc.id)"> Create instance</button>
                              <button className="btn btn-info btn-xs" (click)="processStorage.updateInstances(proc.id)"> Refresh instances</button>
                            </div>
                          </h4>
                        </div>
                        <div [attr.id]="proc.id" className="panel-collapse collapse">
                          <div className="panel-body">
                            <div className="panel-group" id="accordion21">
                              <div className="panel">
                                <a data-toggle="collapse" data-parent="#accordion21" [attr.href]="'#'+proc.id+'_solidity'">Solidity »</a>
                                <div [attr.id]="proc.id+'_solidity'" className="panel-collapse collapse">
                                  <div className="panel-body">
                                    <div>
                                      <pre style={{maxHeight: '30em'}}><code className="language-javascript" [innerhtml]="getSolidity(proc)" /></pre>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="panel">
                                <a data-toggle="collapse" data-parent="#accordion21" [attr.href]="'#'+proc.id+'_instances'">Instances »</a>
                                <div [attr.id]="proc.id+'_instances'" className="panel-collapse collapse in">
                                  <div className="panel-body">
                                    <div *ngfor="let instance of processStorage.getInstance(proc.id)" (click)="openViewer(proc.id, instance)">{'{'}{'{'}instance{'}'}{'}'}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
